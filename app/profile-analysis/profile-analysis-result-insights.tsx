import type { ProfileAnalysis, CollectedLinkedInData } from '@/orca-ai/types';
import { ProfileAnalysisResult } from './profile-analysis-result';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';

interface ProfileAnalysisResultInsightsProps {
  analysis: ProfileAnalysis;
  collectedData: CollectedLinkedInData;
  onViewRawData: () => void;
}

export const ProfileAnalysisResultInsights = ({
  analysis,
  collectedData,
  onViewRawData,
}: ProfileAnalysisResultInsightsProps) => {
  const engagementCount = collectedData.topPostsEngagement.reduce(
    (sum, tpe) => sum + tpe.comments.length + tpe.reactions.length,
    0,
  );

  const badges = [
    `${collectedData.posts.length} posts`,
    `${collectedData.comments.length} comments`,
    `${collectedData.reactions.length} reactions`,
    ...(engagementCount > 0 ? [`${engagementCount} audience engagements`] : []),
  ];

  return (
    <>
      <div className='flex items-center gap-2 mb-6 flex-wrap'>
        <span className='text-xs text-white'>Analysis based on</span>
        {badges.map((label) => (
          <Badge key={label} variant='secondary'>
            {label}
          </Badge>
        ))}
        <span className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onViewRawData}
            className='text-xs text-foreground-secondary cursor-pointer px-1.5'
          >
            View Raw Data
            <SquareArrowOutUpRight className='w-3 h-3' />
          </Button>
        </span>
      </div>
      <ProfileAnalysisResult analysis={analysis} />
    </>
  );
};
