import { describe, it, expect, vi } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { runAnalysis } from '@/orca-ai/analysis-agent';
import { collectLinkedInData } from '@/orca-ai/services/collect-linkedin-data';
import { DEFAULT_INSIGHTS, TESTS_FIXTURES_DIR } from '@/orca-ai/config';
import * as postCommentsScraper from '@/orca-ai/services/linkedin-post-comments-scraper';
import * as postReactionsScraper from '@/orca-ai/services/linkedin-post-reactions-scraper';
import * as activityScraper from '@/orca-ai/services/linkedin-activity-scraper';
import {
  CollectedLinkedInData,
  LinkedInPost,
  LinkedInProfile,
  LinkedInPostComment,
  LinkedInPostReaction,
} from '@/orca-ai/types';

// Set to true to use live LinkedIn scraping instead of fixtures (~11 API credits)
const USE_LIVE_DATA = false;
// Max tool calls the agent can make. 0 = no tools (cheaper/faster, good for prompt iteration)
const MAX_TOOL_CALLS = 0;
const TEST_PROFILE_URL = 'https://linkedin.com/in/dimimikadze';
const RESULT_FILE = `${TESTS_FIXTURES_DIR}/analysis-agent-result.json`;

/**
 * Builds CollectedLinkedInData from existing fixture files.
 * Requires scraper tests to have run first to generate fixtures.
 */
const buildDataFromFixtures = (): CollectedLinkedInData => {
  const profile: LinkedInProfile = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-profile-scraper-result.json`, 'utf-8'),
  );
  const posts: LinkedInPost[] = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-posts-result.json`, 'utf-8'),
  );
  const comments: LinkedInPost[] = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-comments-result.json`, 'utf-8'),
  );
  const reactions: LinkedInPost[] = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-reactions-result.json`, 'utf-8'),
  );
  const topPostComments: LinkedInPostComment[] = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-post-comments-scraper-result.json`, 'utf-8'),
  );
  const topPostReactions: LinkedInPostReaction[] = JSON.parse(
    readFileSync(`${TESTS_FIXTURES_DIR}/linkedin-post-reactions-scraper-result.json`, 'utf-8'),
  );

  // Pick the top post the same way collect-linkedin-data does
  const topPost = [...posts].filter((p) => p.urn).sort((a, b) => (b.num_reactions ?? 0) - (a.num_reactions ?? 0))[0];

  return {
    profile,
    posts,
    comments,
    reactions,
    topPostEngagement: topPost ? { post: topPost, comments: topPostComments, reactions: topPostReactions } : null,
  };
};

describe('runAnalysis', () => {
  it('extracts structured insights from LinkedIn data', { timeout: 120_000 }, async () => {
    const commentsSpy = vi.spyOn(postCommentsScraper, 'scrapePostComments');
    const reactionsSpy = vi.spyOn(postReactionsScraper, 'scrapePostReactions');
    const activitySpy = vi.spyOn(activityScraper, 'scrapeLinkedInActivity');

    const data = USE_LIVE_DATA ? await collectLinkedInData(TEST_PROFILE_URL) : buildDataFromFixtures();

    const result = await runAnalysis(data, DEFAULT_INSIGHTS, { maxToolCalls: MAX_TOOL_CALLS });

    console.info(result);

    // Correct shape
    expect(result.analysis.profileUrl).toBeDefined();
    expect(result.analysis.profileName).toBeDefined();
    expect(result.analysis.insights).toBeInstanceOf(Array);
    expect(result.analysis.insights.length).toBe(DEFAULT_INSIGHTS.length);

    // Every insight category is present with content
    for (const insight of DEFAULT_INSIGHTS) {
      const match = result.analysis.insights.find((i) => i.name === insight.name);
      expect(match, `Missing insight: ${insight.name}`).toBeDefined();
      expect(match!.content.length).toBeGreaterThan(0);
    }

    // Verify tool calls respected MAX_TOOL_CALLS
    const totalToolCalls =
      commentsSpy.mock.calls.length + reactionsSpy.mock.calls.length + activitySpy.mock.calls.length;
    expect(totalToolCalls).toBeLessThanOrEqual(MAX_TOOL_CALLS);

    // Save result for inspection
    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(RESULT_FILE, JSON.stringify(result, null, 2));
  });
});
