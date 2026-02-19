import { CollectedLinkedInData, LinkedInPost, OnProgress, TopPostEngagement } from '@/orca-ai/types';
import { scrapeLinkedInProfile } from './linkedin-profile-scraper';
import { scrapeLinkedInActivity } from './linkedin-activity-scraper';
import { scrapePostComments } from './linkedin-post-comments-scraper';
import { scrapePostReactions } from './linkedin-post-reactions-scraper';
import { DEFAULT_MAX_PAGES, DEFAULT_TOP_POSTS_ENGAGEMENT_COUNT } from '../config';

export interface CollectLinkedInDataOptions {
  maxPages?: number;
  topPostsEngagementCount?: number;
  onProgress?: OnProgress;
}

/**
 * Collects baseline LinkedIn data for a profile. No LLM involved — runs a fixed pipeline.
 *
 * Steps:
 * 1. Scrape profile + posts + comments + reactions in parallel (9 credits)
 * 2. Pick top post by engagement, scrape its comments + reactions (2 credits)
 *
 * Total: ~11 credits per run.
 */
export const collectLinkedInData = async (
  linkedinUrl: string,
  {
    maxPages = DEFAULT_MAX_PAGES,
    topPostsEngagementCount = DEFAULT_TOP_POSTS_ENGAGEMENT_COUNT,
    onProgress,
  }: CollectLinkedInDataOptions = {},
): Promise<CollectedLinkedInData> => {
  console.info(`[collectLinkedInData] Starting baseline collection for ${linkedinUrl}`);
  onProgress?.({ message: 'Collecting LinkedIn data...' });

  // Profile + Activity (parallel)
  const [profile, postsResult, commentsResult, reactionsResult] = await Promise.all([
    scrapeLinkedInProfile(linkedinUrl),
    scrapeLinkedInActivity(linkedinUrl, 'posts', { maxPages }),
    scrapeLinkedInActivity(linkedinUrl, 'comments', { maxPages }),
    scrapeLinkedInActivity(linkedinUrl, 'reactions', { maxPages }),
  ]);

  const posts = postsResult.items;
  const comments = commentsResult.items;
  const reactions = reactionsResult.items;
  const activityPaginationTokens = {
    posts: postsResult.nextPaginationToken,
    comments: commentsResult.nextPaginationToken,
    reactions: reactionsResult.nextPaginationToken,
  };

  // Top posts engagement
  onProgress?.({ message: 'Scraping top post engagements...' });
  const topPostsEngagement = await scrapeTopPostsEngagement(posts, { maxPages, topPostsEngagementCount });

  const tokenSummary = (['posts', 'comments', 'reactions'] as const)
    .filter((type) => activityPaginationTokens[type])
    .join(', ');

  console.info(
    `[collectLinkedInData] Done: profile=${profile.full_name}, posts=${posts.length}, comments=${comments.length}, reactions=${reactions.length}, topPostsEngagement=${topPostsEngagement.length}${tokenSummary ? `, morePages=${tokenSummary}` : ''}`,
  );

  return { profile, posts, comments, reactions, topPostsEngagement, activityPaginationTokens };
};

/**
 * Picks the top N posts by reaction count and scrapes comments + reactions
 * for each, providing a richer view of who engages with the profile's content.
 */
const scrapeTopPostsEngagement = async (
  posts: LinkedInPost[],
  { maxPages, topPostsEngagementCount }: { maxPages: number; topPostsEngagementCount: number },
): Promise<TopPostEngagement[]> => {
  const topPosts = [...posts]
    .filter((p) => p.urn)
    .sort((a, b) => (b.num_reactions ?? 0) - (a.num_reactions ?? 0))
    .slice(0, topPostsEngagementCount);

  if (topPosts.length === 0) return [];

  console.info(
    `[collectLinkedInData] Scraping engagement for ${topPosts.length} top post(s): ${topPosts.map((p) => `urn=${p.urn} reactions=${p.num_reactions}`).join(', ')}`,
  );

  const results = await Promise.all(
    topPosts.map(async (post) => {
      const [comments, reactions] = await Promise.all([
        scrapePostComments(post.urn!, maxPages),
        scrapePostReactions(post.urn!, maxPages),
      ]);
      return { post, comments, reactions };
    }),
  );

  return results;
};
