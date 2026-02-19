import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import { scrapeLinkedInProfile } from '@/orca-ai/services/linkedin-profile-scraper';
import { TESTS_FIXTURES_DIR } from '@/orca-ai/config';

const TEST_PROFILE_URL = 'https://linkedin.com/in/dimimikadze';
const RESULT_FILE = `${TESTS_FIXTURES_DIR}/linkedin-profile-scraper-result.json`;

describe('scrapeLinkedInProfile', () => {
  it('fetches a full profile with all included fields', async () => {
    const profile = await scrapeLinkedInProfile(TEST_PROFILE_URL);

    // Core identity
    expect(profile.full_name).toBeDefined();
    expect(profile.first_name).toBeDefined();
    expect(profile.last_name).toBeDefined();
    expect(profile.linkedin_url).toBeDefined();
    expect(profile.public_id).toBeDefined();

    // Professional info
    expect(profile.headline).toBeDefined();
    expect(profile.job_title).toBeDefined();

    // Location
    expect(profile.location).toBeDefined();

    // Social counts
    expect(profile.follower_count).toBeTypeOf('number');

    // Experiences & educations (arrays from include_* params)
    expect(profile.experiences).toBeInstanceOf(Array);
    expect(profile.experiences!.length).toBeGreaterThan(0);
    expect(profile.educations).toBeInstanceOf(Array);
    expect(profile.educations!.length).toBeGreaterThan(0);

    // Skills (enabled via include_skills=true)
    expect(profile.skills).toBeDefined();

    // Save fixture for agent tests
    mkdirSync(TESTS_FIXTURES_DIR, { recursive: true });
    writeFileSync(RESULT_FILE, JSON.stringify(profile, null, 2));
  });
});
