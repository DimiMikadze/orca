import { LinkedInPost } from '@/orca-ai/types';
import { trackCredits } from '../utils/linkedin-api-credits';
import { DEFAULT_MAX_PAGES } from '../config';

const RAPIDAPI_HOST = 'fresh-linkedin-profile-data.p.rapidapi.com';

type ActivityType = 'posts' | 'comments' | 'reactions';

interface ScrapeActivityOptions {
  maxPages?: number;
  /** Maximum age of posts in years. Posts older than this are filtered out. Default: 1. */
  maxAge?: number;
  /** Pagination token from a previous call — starts fetching from that point instead of page 1. */
  startPaginationToken?: string;
  /** Start offset (e.g. 50 to skip page 1). Used together with startPaginationToken. Default: 0. */
  startFrom?: number;
}

interface ActivityResult {
  items: LinkedInPost[];
  /** Token to pass as startPaginationToken to fetch the next page. Only set when more pages exist. */
  nextPaginationToken?: string;
}

/**
 * Scrapes a person's LinkedIn activity using the /get-profile-posts endpoint. 2 credits per page.
 * Each page returns up to 50 items.
 *
 * All three activity types return the same LinkedInPost shape:
 * - "posts": posts authored or reshared by the person
 * - "comments": posts the person commented on (includes highlighted_comments field)
 * - "reactions": posts the person reacted to
 *
 * Items are returned in reverse chronological order. Once an entire page falls outside the
 * maxAge window, pagination stops early to save API credits.
 *
 * @param linkedinUrl - Full LinkedIn profile URL
 * @param type - Activity type to fetch: "posts", "comments", or "reactions"
 * @param options.maxPages - Safety cap on pages to fetch (default 1)
 * @param options.maxAge - Max age in years (default 1). Posts older than this are discarded.
 */
export const scrapeLinkedInActivity = async (
  linkedinUrl: string,
  type: ActivityType,
  { maxPages = DEFAULT_MAX_PAGES, maxAge = 1, startPaginationToken, startFrom = 0 }: ScrapeActivityOptions = {},
): Promise<ActivityResult> => {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - maxAge);

  const allResults: LinkedInPost[] = [];
  let start = startFrom;
  let page = 0;
  let paginationToken: string | undefined = startPaginationToken;
  let nextPaginationToken: string | undefined;

  console.info(
    `[scrapeLinkedInActivity] Starting: type=${type}, maxPages=${maxPages}, maxAge=${maxAge}y, cutoff=${cutoff.toISOString()}, url=${linkedinUrl}${startFrom > 0 ? `, startFrom=${startFrom}` : ''}`,
  );

  while (true) {
    const url = new URL(`https://${RAPIDAPI_HOST}/get-profile-posts`);
    url.searchParams.set('linkedin_url', linkedinUrl);
    url.searchParams.set('type', type);
    url.searchParams.set('start', String(start));
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
        `[scrapeLinkedInActivity] API error: ${response.status} ${response.statusText}, type=${type}, start=${start}`,
      );
      throw new Error(`[scrapeLinkedInActivity] ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const items: LinkedInPost[] = json.data ?? [];

    const recent = items.filter((item) => {
      if (!item.posted) return true;
      return new Date(item.posted) >= cutoff;
    });

    allResults.push(...recent);
    page++;

    console.info(
      `[scrapeLinkedInActivity] Page ${page}/${maxPages}: fetched ${items.length}, kept ${recent.length} within ${maxAge}y (total: ${allResults.length})`,
    );

    // All items on this page were too old — nothing newer ahead
    if (recent.length === 0 && items.length > 0) {
      console.info(`[scrapeLinkedInActivity] All items on page ${page} outside cutoff, stopping early`);
      break;
    }

    // End of data — API returned a partial page, no more pages exist
    if (items.length < 50) break;

    // Hit our page limit — more data exists, save token so caller can continue
    if (page >= maxPages) {
      nextPaginationToken = json.paging?.pagination_token ?? undefined;
      break;
    }

    start += 50;
    paginationToken = json.paging?.pagination_token ?? undefined;
  }

  console.info(
    `[scrapeLinkedInActivity] Done: ${allResults.length} ${type} within ${maxAge}y${nextPaginationToken ? ', more pages available' : ''}`,
  );
  return { items: allResults, nextPaginationToken };
};
