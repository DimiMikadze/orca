import { LinkedInProfile } from '@/orca-ai/types';
import { trackCredits } from '../utils/linkedin-api-credits';

const RAPIDAPI_HOST = 'fresh-linkedin-profile-data.p.rapidapi.com';

/**
 * Scrapes a full LinkedIn profile using the /enrich-lead endpoint. 3 credits per call.
 * Fetches all available fields: skills, certifications, publications, honors, volunteers,
 * projects, patents, courses, organizations, company info, and profile status.
 *
 * @param linkedinUrl - Full LinkedIn profile URL
 */
export const scrapeLinkedInProfile = async (linkedinUrl: string): Promise<LinkedInProfile> => {
  console.info(`[scrapeLinkedInProfile] Starting: url=${linkedinUrl}`);

  const url = new URL(`https://${RAPIDAPI_HOST}/enrich-lead`);
  url.searchParams.set('linkedin_url', linkedinUrl);
  url.searchParams.set('include_skills', 'true');
  url.searchParams.set('include_certifications', 'true');
  url.searchParams.set('include_publications', 'true');
  url.searchParams.set('include_honors', 'true');
  url.searchParams.set('include_volunteers', 'true');
  url.searchParams.set('include_projects', 'true');
  url.searchParams.set('include_patents', 'true');
  url.searchParams.set('include_courses', 'true');
  url.searchParams.set('include_organizations', 'true');
  url.searchParams.set('include_company_public_url', 'true');
  url.searchParams.set('include_profile_status', 'true');

  const response = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
    },
  });

  trackCredits(response);

  if (!response.ok) {
    console.error(`[scrapeLinkedInProfile] API error: ${response.status} ${response.statusText}, url=${linkedinUrl}`);
    throw new Error(`[scrapeLinkedInProfile] ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const profile: LinkedInProfile = json.data;

  console.info(`[scrapeLinkedInProfile] Done: ${profile.full_name} (${profile.job_title} at ${profile.company})`);
  return profile;
};
