import type { ProfileAnalysis } from '@/orca-ai/types';
import { ProfileAnalysisResult } from './profile-analysis-result';

interface ProfileAnalysisResultInsightsProps {
  analysis: ProfileAnalysis;
}

export const ProfileAnalysisResultInsights = ({ analysis }: ProfileAnalysisResultInsightsProps) => (
  <ProfileAnalysisResult analysis={analysis} />
);
