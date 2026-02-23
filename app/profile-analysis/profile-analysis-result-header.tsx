import type { ProfileAnalysis, LinkedInProfile, CollectedLinkedInData } from '@/orca-ai/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';

interface ProfileAnalysisResultHeaderProps {
  analysis: ProfileAnalysis;
  profile: LinkedInProfile;
  collectedData: CollectedLinkedInData;
  onViewRawData: () => void;
}

export const ProfileAnalysisResultHeader = ({
  analysis,
  profile,
  collectedData,
  onViewRawData,
}: ProfileAnalysisResultHeaderProps) => {
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
    <div className='mb-8'>
      <div className='flex items-center gap-5 mb-4'>
        {profile.profile_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profile_image_url}
            alt={analysis.profileName}
            className='w-20 h-20 rounded-full object-cover shrink-0 ring-2 ring-white'
          />
        )}
        <div>
          <h2 className='text-2xl font-bold text-foreground'>{analysis.profileName}</h2>
          {profile.headline && <p className='text-sm text-foreground-secondary mt-0.5'>{profile.headline}</p>}
          <div className='flex items-center gap-2 mt-1.5 text-xs text-foreground-secondary'>
            {profile.location && <span>{profile.location}</span>}
            {profile.location && (profile.connection_count || profile.follower_count) && <span>·</span>}
            {profile.connection_count && <span>{profile.connection_count.toLocaleString()} connections</span>}
            {profile.connection_count && profile.follower_count && <span>·</span>}
            {profile.follower_count && <span>{profile.follower_count.toLocaleString()} followers</span>}
          </div>
          <a
            href={analysis.profileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-primary hover:underline mt-1 inline-block'
          >
            View LinkedIn profile
          </a>
        </div>
      </div>

      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-xs text-white'>Analysis based on</span>
        {badges.map((label) => (
          <Badge key={label} variant='secondary'>
            {label}
          </Badge>
        ))}
        <Button
          variant='ghost'
          size='sm'
          onClick={onViewRawData}
          className='text-xs text-foreground-secondary cursor-pointer px-1.5'
        >
          View Raw Data
          <SquareArrowOutUpRight className='w-3 h-3' />
        </Button>
      </div>
    </div>
  );
};
