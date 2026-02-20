import { InsightDefinition } from './types';

/**
 * Cookie name used to track LinkedIn API credit consumption across requests.
 */
export const LINKEDIN_CREDITS_COOKIE_NAME = 'linkedin_api_credits';

/**
 * Filesystem path to test fixture files (recorded API responses used in tests).
 */
export const TESTS_FIXTURES_DIR = 'orca-ai/__tests__/fixtures';

/**
 * Maximum number of agent tool calls allowed per analysis run.
 * Acts as a circuit breaker to prevent runaway agents from burning API credits.
 */
export const DEFAULT_MAX_TOOL_CALLS = 3;

/**
 * AI model used by the analysis agent.
 * e.g. 'gpt-5.2', 'gpt-5-mini'
 */
export const ANALYSIS_MODEL = 'gpt-5.2';

/**
 * Safety cap on the number of pages fetched per scraper call.
 * Each page costs 1–2 API credits, so this limits worst-case spend.
 * Scrapers accept a `maxPages` override to fetch more when needed.
 */
export const DEFAULT_MAX_PAGES = 1;

/**
 * Number of top-performing posts (ranked by reaction count) to scrape
 * audience engagement for (comments + reactions per post).
 * Higher values give richer audience data at the cost of more API credits.
 * Each additional post costs roughly 2 credits (1 for comments + 1 for reactions, per page).
 */
export const DEFAULT_TOP_POSTS_ENGAGEMENT_COUNT = 3;

/**
 * Default insight categories passed to the analysis agent.
 * Each defines a named lens the agent uses to interpret LinkedIn data.
 */
export const DEFAULT_INSIGHTS: InsightDefinition[] = [
  {
    name: 'Pain points',
    description: 'Problems they complain about, challenges they mention, frustrations in posts and comments',
  },
  {
    name: 'Current focus',
    description: 'Topics dominating their recent activity, what they are actively working on or thinking about',
  },
  { name: 'Values', description: 'What they consistently defend, celebrate, or push back on' },
  {
    name: 'Network influence',
    description:
      'Who they engage with most and who engages with them. Classify each as mutual or one-way. Note interaction type (reactions, comments, replies, collaboration). Flag any clusters.',
  },
  {
    name: 'Expertise',
    description:
      'Topics where they demonstrate real depth (detailed posts, nuanced comments) vs surface-level mentions',
  },
  {
    name: 'Communication style',
    description:
      'How they communicate: long vs short posts, questions vs statements, data vs stories, technical vs accessible, formal vs casual',
  },
  {
    name: 'Hidden interests',
    description: 'What their reactions reveal that their posts do not. People curate posts but react instinctively',
  },
  {
    name: 'Beyond the bio',
    description:
      'Gap between their stated identity (headline, about, job title) and where they actually spend their attention',
  },
  {
    name: 'What resonates',
    description:
      'Rank authored posts by engagement from highest to lowest with approximate counts or relative scale. Identify what separates top performers from low performers. Only consider posts they wrote.',
  },
  {
    name: 'Topic evolution',
    description: 'How their interests have shifted over time. What they talked about 6 months ago vs now',
  },
];
