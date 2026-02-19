import { LinkedInApiCredits } from '@/orca-ai/types';

let latestCredits: LinkedInApiCredits | null = null;

/**
 * Updates the credit tracker from a RapidAPI response.
 * Call this after every fetch to a RapidAPI endpoint.
 */
export const trackCredits = (response: Response) => {
  const limit = response.headers.get('x-ratelimit-credits-limit');
  const remaining = response.headers.get('x-ratelimit-requests-remaining');

  if (limit && remaining) {
    latestCredits = { limit: Number(limit), remaining: Number(remaining) };
  }
};

/**
 * Returns the last known credit info, or null if no requests have been made yet.
 */
export const getCredits = () => latestCredits;
