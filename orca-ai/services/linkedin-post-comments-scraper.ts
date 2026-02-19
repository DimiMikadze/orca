import { LinkedInPostComment } from '@/orca-ai/types';
import { trackCredits } from '../utils/linkedin-api-credits';
import { DEFAULT_MAX_PAGES } from '../config';

const RAPIDAPI_HOST = 'fresh-linkedin-profile-data.p.rapidapi.com';

/**
 * Scrapes comments on a specific LinkedIn post using its URN (unique resource name).
 * Uses the /get-post-comments endpoint. 1 credit per page.
 *
 * @param urn - The post's URN identifier (e.g. "7378306963828441088")
 * @param maxPages - Number of pages to fetch (default 1). Each page returns a batch of comments.
 */
export const scrapePostComments = async (urn: string, maxPages = DEFAULT_MAX_PAGES): Promise<LinkedInPostComment[]> => {
  const allResults: LinkedInPostComment[] = [];
  let page = 1;
  let paginationToken: string | undefined;

  console.info(`[scrapePostComments] Starting: urn=${urn}, maxPages=${maxPages}`);

  while (true) {
    const url = new URL(`https://${RAPIDAPI_HOST}/get-post-comments`);
    url.searchParams.set('urn', urn);
    url.searchParams.set('page', String(page));
    if (paginationToken) {
      url.searchParams.set('pagination_token', paginationToken);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
      },
    });

    trackCredits(response);

    if (!response.ok) {
      console.error(
        `[scrapePostComments] API error: ${response.status} ${response.statusText}, urn=${urn}, page=${page}`,
      );
      throw new Error(`[scrapePostComments] ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const items = json.data ?? [];
    allResults.push(...items);

    console.info(
      `[scrapePostComments] Page ${page}/${maxPages}: fetched ${items.length} comments (total: ${allResults.length})`,
    );

    // Stop if no more data or we hit maxPages
    if (items.length === 0 || page >= maxPages) break;

    page++;
    paginationToken = json.pagination_token;
  }

  console.info(`[scrapePostComments] Done: ${allResults.length} comments`);
  return allResults;
};
