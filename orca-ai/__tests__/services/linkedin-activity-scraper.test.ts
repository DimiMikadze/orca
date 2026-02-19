import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import { scrapeLinkedInActivity } from '@/orca-ai/services/linkedin-activity-scraper';
import { TESTS_FIXTURES_DIR } from '@/orca-ai/config';

const TEST_PROFILE_URL = 'https://linkedin.com/in/dimimikadze';
const POSTS_RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-posts-result.json`;
const COMMENTS_RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-comments-result.json`;
const REACTIONS_RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-activity-scraper-reactions-result.json`;

describe('scrapeLinkedInActivity', () => {
  it('fetches posts', async () => {
    const posts = await scrapeLinkedInActivity(TEST_PROFILE_URL, 'posts', { maxPages: 1 });

    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].urn).toBeDefined();
    expect(posts[0].text).toBeDefined();

    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(POSTS_RESULT_FILE, JSON.stringify(posts, null, 2));
  });

  it('fetches comments', async () => {
    const comments = await scrapeLinkedInActivity(TEST_PROFILE_URL, 'comments', { maxPages: 1 });

    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].urn).toBeDefined();

    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(COMMENTS_RESULT_FILE, JSON.stringify(comments, null, 2));
  });

  it('fetches reactions', async () => {
    const reactions = await scrapeLinkedInActivity(TEST_PROFILE_URL, 'reactions', { maxPages: 1 });

    expect(reactions).toBeInstanceOf(Array);
    expect(reactions.length).toBeGreaterThan(0);
    expect(reactions[0].urn).toBeDefined();

    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(REACTIONS_RESULT_FILE, JSON.stringify(reactions, null, 2));
  });
});
