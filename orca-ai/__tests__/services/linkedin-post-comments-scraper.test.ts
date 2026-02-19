import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { scrapePostComments } from '@/orca-ai/services/linkedin-post-comments-scraper';
import { TESTS_FIXTURES_DIR } from '@/orca-ai/config';
import { LinkedInPost } from '@/orca-ai/types';

const POSTS_FIXTURE_FILE = `${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-posts-result.json`;
const RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-post-comments-scraper-result.json`;

describe('scrapePostComments', () => {
  it('fetches comments for a post with comments', async () => {
    const posts: LinkedInPost[] = JSON.parse(readFileSync(POSTS_FIXTURE_FILE, 'utf-8'));
    const postWithComments = posts.find((p) => p.num_comments && p.num_comments > 0);
    expect(postWithComments).toBeDefined();

    const comments = await scrapePostComments(postWithComments!.urn!, 1);

    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);

    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(RESULT_FILE, JSON.stringify(comments, null, 2));
  });
});
