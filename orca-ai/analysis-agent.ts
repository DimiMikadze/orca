import { z } from 'zod';
import { createAgent, tool } from 'langchain';
import { scrapePostComments } from './services/linkedin-post-comments-scraper';
import { scrapePostReactions } from './services/linkedin-post-reactions-scraper';
import { scrapeLinkedInActivity } from './services/linkedin-activity-scraper';
import { CollectedLinkedInData, InsightDefinition, OnProgress, ProfileAnalysis } from './types';
import { formatLinkedInData } from './utils/format-linkedin-data';
import { ANALYSIS_MODEL, DEFAULT_MAX_TOOL_CALLS } from './config';

/**
 * Analysis Agent — Processes collected LinkedIn data to extract structured insights.
 *
 * Receives CollectedLinkedInData as context and a set of InsightDefinitions to analyze.
 * Has scraping tools to autonomously investigate deeper when it spots something interesting.
 *
 * Tools:
 * - scrape_post_comments: Drill into a specific post's comments (1 credit/page)
 * - scrape_post_reactions: Drill into a specific post's reactions (1 credit/page)
 * - scrape_more_activity: Fetch additional pages of activity (2 credits/page)
 */

const SYSTEM_PROMPT =
  'You are a LinkedIn behavior analyst. You extract insights from real activity data. Never speculate, every claim must be grounded in specific evidence from the data.';

const outputSchema = z.object({
  insights: z.array(
    z.object({
      name: z.string().describe('Must match the insight category name exactly'),
      content: z.string().describe('Detailed analysis with cited evidence from the data'),
    }),
  ),
});

const buildUserPrompt = (insights: InsightDefinition[], formattedData: string, maxToolCalls: number): string => {
  const insightList = insights.map((insight, i) => `${i + 1}. **${insight.name}:** ${insight.description}`).join('\n');

  const toolSection =
    maxToolCalls > 0
      ? `You have scraping tools available.
Only use them if you need specific data to answer an insight and that data is not in the context below.
Do not fetch data out of curiosity.
Max ${maxToolCalls} tool calls.
Posts listed under "Top Post Deep Dive" sections already have comments and reactions collected. All other posts do not.`
      : 'Do NOT use any tools. Analyze only the data provided below.';

  return `Analyze this LinkedIn data and extract insights from real behavior.

${toolSection}

Extract these insights:
${insightList}

Rules:
- Output exactly one entry per insight category. Never split an insight into multiple entries. 
- Write in paragraphs. One paragraph per observation. No bullet lists, no bold text.
- Describe what the person does and what it reveals. Do not quote post titles or paste metrics inline.
- When referencing a post or comment, add [post](url) at the end of the sentence. Use the exact URL from the data. Never fabricate URLs.
- When mentioning a person, link their name inline: [Person Name](url).
- No em dashes. Write in third person. Never use "you", "I", or "I can".

<linkedin-data>
${formattedData}
</linkedin-data>`;
};

export interface AnalysisOptions {
  /** Max tool calls the agent can make. 0 = no tools. Default: 3 */
  maxToolCalls?: number;
  onProgress?: OnProgress;
}

export interface AnalysisResult {
  analysis: ProfileAnalysis;
  toolCallCount: number;
}

/**
 * Runs the analysis agent on collected LinkedIn data and returns structured insights.
 */
export const runAnalysis = async (
  data: CollectedLinkedInData,
  insights: InsightDefinition[],
  options?: AnalysisOptions,
): Promise<AnalysisResult> => {
  const maxToolCalls = options?.maxToolCalls ?? DEFAULT_MAX_TOOL_CALLS;
  const onProgress = options?.onProgress;
  let toolCallCount = 0;

  // Cache already-collected post comments/reactions — prevents re-fetching top posts
  const postCommentsCache = new Map(data.topPostsEngagement.map((tpe) => [tpe.post.urn, tpe.comments]));
  const postReactionsCache = new Map(data.topPostsEngagement.map((tpe) => [tpe.post.urn, tpe.reactions]));

  const scrapePostCommentsTool = tool(
    async ({ urn, maxPages }: { urn: string; maxPages: number }) => {
      if (postCommentsCache.has(urn)) {
        const cached = postCommentsCache.get(urn)!;
        console.info(
          `[analysis-agent] Cache hit: scrape_post_comments (urn=${urn}) — ${cached.length} comments already collected`,
        );
        return JSON.stringify(cached);
      }
      toolCallCount++;
      onProgress?.({ message: 'Investigating post comments...' });
      console.info(
        `[analysis-agent] Tool call #${toolCallCount}: scrape_post_comments (urn=${urn}, maxPages=${maxPages})`,
      );
      const comments = await scrapePostComments(urn, maxPages);
      console.info(`[analysis-agent] Got ${comments.length} comments`);
      postCommentsCache.set(urn, comments);
      return JSON.stringify(comments);
    },
    {
      name: 'scrape_post_comments',
      description:
        'Scrape comments on a specific LinkedIn post by URN. Use this when you spot a post with interesting discussion worth investigating deeper. 1 credit per page.',
      schema: z.object({
        urn: z.string().describe('The post URN identifier'),
        maxPages: z.number().describe('Number of pages to fetch, use 1 if unsure'),
      }),
    },
  );

  const scrapePostReactionsTool = tool(
    async ({ urn, maxPages }: { urn: string; maxPages: number }) => {
      if (postReactionsCache.has(urn)) {
        const cached = postReactionsCache.get(urn)!;
        console.info(
          `[analysis-agent] Cache hit: scrape_post_reactions (urn=${urn}) — ${cached.length} reactions already collected`,
        );
        return JSON.stringify(cached);
      }
      toolCallCount++;
      onProgress?.({ message: 'Investigating post reactions...' });
      console.info(
        `[analysis-agent] Tool call #${toolCallCount}: scrape_post_reactions (urn=${urn}, maxPages=${maxPages})`,
      );
      const reactions = await scrapePostReactions(urn, maxPages);
      console.info(`[analysis-agent] Got ${reactions.length} reactions`);
      postReactionsCache.set(urn, reactions);
      return JSON.stringify(reactions);
    },
    {
      name: 'scrape_post_reactions',
      description:
        'Scrape reactions on a specific LinkedIn post by URN. Use this to see who engaged with a particular post and how. 1 credit per page.',
      schema: z.object({
        urn: z.string().describe('The post URN identifier'),
        maxPages: z.number().describe('Number of pages to fetch, use 1 if unsure'),
      }),
    },
  );

  const scrapeMoreActivityTool = tool(
    async ({ type, maxPages }: { type: 'posts' | 'comments' | 'reactions'; maxPages: number }) => {
      const token = data.activityPaginationTokens[type];
      if (!token) {
        console.info(
          `[analysis-agent] scrape_more_activity (type=${type}): no more pages — baseline already fetched everything`,
        );
        return JSON.stringify([]);
      }
      toolCallCount++;
      onProgress?.({ message: `Fetching more ${type}...` });
      console.info(
        `[analysis-agent] Tool call #${toolCallCount}: scrape_more_activity (type=${type}, maxPages=${maxPages})`,
      );
      const { items } = await scrapeLinkedInActivity(data.profile.linkedin_url!, type, {
        maxPages,
        startPaginationToken: token,
        startFrom: 50,
      });
      console.info(`[analysis-agent] Got ${items.length} items`);
      return JSON.stringify(items);
    },
    {
      name: 'scrape_more_activity',
      description:
        'Fetch additional activity (posts, comments, or reactions) beyond what was already collected. Starts from where baseline left off — never re-fetches existing data. 2 credits per page.',
      schema: z.object({
        type: z.enum(['posts', 'comments', 'reactions']).describe('Activity type to fetch'),
        maxPages: z.number().describe('Number of additional pages to fetch, use 1 if unsure'),
      }),
    },
  );

  const tools = maxToolCalls > 0 ? [scrapePostCommentsTool, scrapePostReactionsTool, scrapeMoreActivityTool] : [];

  console.info(`[analysis-agent] Starting analysis (insights=${insights.length}, maxToolCalls=${maxToolCalls})`);
  onProgress?.({ message: 'Analyzing profile...' });

  const agent = createAgent({
    model: ANALYSIS_MODEL,
    tools,
    name: 'analysis_agent',
    systemPrompt: SYSTEM_PROMPT,
    responseFormat: outputSchema,
  });

  const formattedData = formatLinkedInData(data);
  const userPrompt = buildUserPrompt(insights, formattedData, maxToolCalls);

  try {
    const result = await agent.invoke({
      messages: [{ role: 'user', content: userPrompt }],
    });

    if (!result.structuredResponse) {
      throw new Error('Analysis agent returned no structured response');
    }

    console.info(`[analysis-agent] Done. ${result.structuredResponse.insights.length} insights, ${toolCallCount} tool calls`);

    return {
      analysis: {
        profileUrl: data.profile.linkedin_url ?? '',
        profileName: data.profile.full_name ?? '',
        insights: result.structuredResponse.insights,
      },
      toolCallCount,
    };
  } catch (error) {
    console.error(`[analysis-agent] Failed:`, error);
    throw new Error(`Analysis agent failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
