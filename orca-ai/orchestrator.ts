import { collectLinkedInData } from './services/collect-linkedin-data';
import { runAnalysis } from './analysis-agent';
import { DEFAULT_INSIGHTS, DEFAULT_MAX_PAGES, DEFAULT_TOP_POSTS_ENGAGEMENT_COUNT } from './config';
import { AnalysisStats, CollectedLinkedInData, InsightDefinition, OnProgress, ProfileAnalysis } from './types';

export interface AnalyzeProfileOptions {
  onProgress?: OnProgress;
  maxPages?: number;
  topPostsEngagementCount?: number;
  insights?: InsightDefinition[];
}

export interface AnalyzeProfileResult {
  analysis: ProfileAnalysis;
  collectedData: CollectedLinkedInData;
  stats: AnalysisStats;
}

/**
 * Full pipeline: collects LinkedIn data via fixed scraping, then runs the analysis agent
 * to extract structured insights with optional deeper investigation.
 */
export const analyzeProfile = async (
  url: string,
  {
    onProgress,
    maxPages = DEFAULT_MAX_PAGES,
    topPostsEngagementCount = DEFAULT_TOP_POSTS_ENGAGEMENT_COUNT,
    insights = DEFAULT_INSIGHTS,
  }: AnalyzeProfileOptions = {},
): Promise<AnalyzeProfileResult> => {
  const totalStart = Date.now();

  // Collect baseline LinkedIn data (no LLM, ~11 credits)
  const collectStart = Date.now();
  const data = await collectLinkedInData(url, { maxPages, topPostsEngagementCount, onProgress });
  const collectDurationMs = Date.now() - collectStart;

  // Analysis agent extracts insights, may use tools for deeper investigation
  const analysisStart = Date.now();
  const { analysis, toolCallCount } = await runAnalysis(data, insights, { onProgress });
  const analysisDurationMs = Date.now() - analysisStart;

  const totalDurationMs = Date.now() - totalStart;

  const stats: AnalysisStats = {
    collectDurationMs,
    analysisDurationMs,
    totalDurationMs,
    toolCallCount,
    insightCount: analysis.insights.length,
  };

  onProgress?.({ message: 'Analysis complete' });

  return { analysis, collectedData: data, stats };
};
