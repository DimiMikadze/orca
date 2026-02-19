import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { scrapePostReactions } from '@/orca-ai/services/linkedin-post-reactions-scraper';
import { TESTS_FIXTURES_DIR } from '@/orca-ai/config';
import { LinkedInPost } from '@/orca-ai/types';

const POSTS_FIXTURE_FILE = `${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-posts-result.json`;
const RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-post-reactions-scraper-result.json`;

describe('scrapePostReactions', () => {
  it('fetches reactions for a post with reactions', async () => {
    const posts: LinkedInPost[] = JSON.parse(readFileSync(POSTS_FIXTURE_FILE, 'utf-8'));
    const postWithReactions = posts.find((p) => p.num_reactions && p.num_reactions > 0);
    expect(postWithReactions).toBeDefined();

    const reactions = await scrapePostReactions(postWithReactions!.urn!, 1);

    expect(reactions).toBeInstanceOf(Array);
    expect(reactions.length).toBeGreaterThan(0);

    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(RESULT_FILE, JSON.stringify(reactions, null, 2));
  });
});
