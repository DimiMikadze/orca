import { LinkedInApiCredits } from '@/orca-ai/types';

let latestCredits: LinkedInApiCredits | null = null;

/**
 * Updates the credit tracker from a RapidAPI response.
 * Call this after every fetch to a RapidAPI endpoint.
 */
export const trackCredits = (response: Response) => {
  const creditsLimit = response.headers.get('x-ratelimit-credits-limit');
  const creditsRemaining = response.headers.get('x-ratelimit-credits-remaining');
  const requestsLimit = response.headers.get('x-ratelimit-requests-limit');
  const requestsRemaining = response.headers.get('x-ratelimit-requests-remaining');

  if (creditsLimit && creditsRemaining && requestsLimit && requestsRemaining) {
    latestCredits = {
      creditsLimit: Number(creditsLimit),
      creditsRemaining: Number(creditsRemaining),
      requestsLimit: Number(requestsLimit),
      requestsRemaining: Number(requestsRemaining),
    };
  }
};

/**
 * Returns the last known credit info, or null if no requests have been made yet.
 */
export const getCredits = () => latestCredits;
