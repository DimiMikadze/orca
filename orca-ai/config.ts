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
 * General-purpose insight preset. A broad lens for understanding any LinkedIn profile.
 */
export const DEFAULT_GENERAL_INSIGHTS: InsightDefinition[] = [
  {
    name: 'Current focus',
    description: 'Topics dominating their recent activity. What they are actively working on or thinking about',
  },
  {
    name: 'Expertise',
    description:
      'Topics where they demonstrate real depth through detailed posts and nuanced comments, vs surface-level mentions',
  },
  {
    name: 'Values',
    description: 'What they consistently defend, celebrate, or push back on across posts and comments',
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
      'Rank authored posts by engagement from highest to lowest. Identify what separates top performers from low performers. Only consider posts they wrote',
  },
  {
    name: 'Network influence',
    description:
      'Who they interact with most and who interacts with them. Are these relationships mutual or one-way? Any notable names or recurring people worth flagging',
  },
  {
    name: 'Topic evolution',
    description: 'How their interests and focus have shifted over time. What they talked about 6 months ago vs now',
  },
];

/**
 * Sales-oriented preset. Focused on understanding a prospect before outreach.
 */
export const DEFAULT_SALES_INSIGHTS: InsightDefinition[] = [
  {
    name: 'Challenges',
    description:
      'What is consuming their attention, creating friction, or holding back progress based on their public activity',
  },
  {
    name: 'Content themes',
    description:
      'Topics they repeatedly post about, share, and engage with. What they consistently care about and come back to',
  },
  {
    name: 'Trigger events',
    description:
      'Recent changes visible from their profile or posts: new role, team growth, product launch, or strategic shift that may open new conversations',
  },
  {
    name: 'Decision style',
    description:
      'How they reason publicly: data-driven vs intuitive, who they reference, how they structure arguments and weigh tradeoffs',
  },
  {
    name: 'Communication preferences',
    description:
      'What tone, length, and format resonates with them based on what they post and engage with. Data vs story, formal vs direct',
  },
];

/**
 * Recruiting preset. Focused on assessing a candidate beyond their resume.
 */
export const DEFAULT_RECRUITING_INSIGHTS: InsightDefinition[] = [
  {
    name: 'Motivators',
    description:
      'What genuinely excites them beyond job titles. What they talk about with energy and conviction in posts and comments',
  },
  {
    name: 'Values',
    description:
      'What they consistently stand for and push back on. A strong signal for cultural fit beyond the resume',
  },
  {
    name: 'Expertise',
    description: 'Topics where they demonstrate real depth. What they can teach, not just mention',
  },
  {
    name: 'Collaboration style',
    description:
      'How they talk about working with others: do they credit teams, share knowledge publicly, engage constructively in discussions, or operate mostly solo',
  },
  {
    name: 'Career trajectory',
    description:
      'Where they are heading based on recent activity. What they are building toward and what kind of challenge they appear ready for next',
  },
];

/**
 * Investing preset. Focused on evaluating a founder and their startup positioning.
 */
export const DEFAULT_INVESTING_INSIGHTS: InsightDefinition[] = [
  {
    name: 'Founder thesis',
    description:
      'Core conviction about the market. What they believe that others do not, and how clearly and consistently they articulate it',
  },
  {
    name: 'Market positioning',
    description: 'How they define their space, articulate their edge, and talk about the competitive landscape',
  },
  {
    name: 'Execution evidence',
    description:
      'Concrete signs of momentum visible from their activity: launches, milestones, decisions under pressure, consistent follow-through',
  },
  {
    name: 'Network quality',
    description:
      'Who surrounds them and actively engages: investors, operators, advisors, customers. Depth of relationships over time',
  },
  {
    name: 'Thinking evolution',
    description:
      'How their views have sharpened over time. Where they have refined their thesis and what has stayed consistent',
  },
];

/**
 * Alias for DEFAULT_GENERAL_INSIGHTS. Kept for backward compatibility.
 */
export const DEFAULT_INSIGHTS = DEFAULT_GENERAL_INSIGHTS;
