import { describe, it, expect } from 'vitest';
import { formatLinkedInData } from '@/orca-ai/utils/format-linkedin-data';
import { CollectedLinkedInData, LinkedInPost } from '@/orca-ai/types';
import profile from '../fixtures/linkedin-profile-scraper-result.json';
import posts from '../fixtures/linkedin-activity-scraper-posts-result.json';
import comments from '../fixtures/linkedin-activity-scraper-comments-result.json';
import reactions from '../fixtures/linkedin-activity-scraper-reactions-result.json';
import topPostComments from '../fixtures/linkedin-post-comments-scraper-result.json';
import topPostReactions from '../fixtures/linkedin-post-reactions-scraper-result.json';

const getTopPost = (posts: LinkedInPost[]): LinkedInPost | undefined =>
  [...posts].filter((p) => p.urn).sort((a, b) => (b.num_reactions ?? 0) - (a.num_reactions ?? 0))[0];

const buildTestData = (): CollectedLinkedInData => {
  const topPost = getTopPost(posts as LinkedInPost[]);

  return {
    profile,
    posts: posts as LinkedInPost[],
    comments: comments as LinkedInPost[],
    reactions: reactions as LinkedInPost[],
    topPostEngagement: topPost ? { post: topPost, comments: topPostComments, reactions: topPostReactions } : null,
  };
};

describe('formatLinkedInData', () => {
  it('formats collected data into readable output', () => {
    const data = buildTestData();
    const output = formatLinkedInData(data);

    console.log(output);

    // Has all major sections
    expect(output).toContain('## Profile');
    expect(output).toContain('## Posts');
    expect(output).toContain('## Comments');
    expect(output).toContain('## Reactions');
    expect(output).toContain('## Top Post Deep Dive');
  });
});
