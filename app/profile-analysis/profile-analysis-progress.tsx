'use client';

import { LoaderCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const INSIGHT_COUNT = 10;

// Simulate varying paragraph widths for a more natural skeleton look
const INSIGHT_LINES = [
  ['w-full', 'w-full', 'w-4/5'],
  ['w-full', 'w-full', 'w-full', 'w-3/4'],
  ['w-full', 'w-11/12', 'w-full', 'w-2/3'],
];

interface ProfileAnalysisProgressProps {
  progress: string | null;
}

/**
 * Loading state for profile analysis. Shows a live progress message alongside
 * skeleton placeholders that mirror the layout of ProfileAnalysisResult.
 */
export const ProfileAnalysisProgress = ({ progress }: ProfileAnalysisProgressProps) => {
  return (
    <div>
      {/* Progress message */}
      <div className='flex items-center gap-3 text-white mb-4'>
        <LoaderCircle className='w-4 h-4 animate-spin shrink-0' />
        <p className='text-sm'>{progress ?? 'Starting...'}</p>
      </div>

      {/* "Analysis based on" badge row skeleton */}
      <div className='flex items-center gap-2 mb-6 flex-wrap'>
        <Skeleton className='h-4 w-24' />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-6 w-20 rounded-full' />
        ))}
        <Skeleton className='h-6 w-24' />
      </div>

      {/* Profile header skeleton */}
      <div className='mb-10 flex items-center gap-5'>
        <Skeleton className='w-20 h-20 rounded-full shrink-0' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-7 w-44' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-3 w-52' />
          <Skeleton className='h-3 w-28' />
        </div>
      </div>

      {/* Insight skeletons */}
      <div className='space-y-8'>
        {Array.from({ length: INSIGHT_COUNT }).map((_, i) => {
          const lines = INSIGHT_LINES[i % INSIGHT_LINES.length];
          return (
            <div key={i}>
              {/* Insight title */}
              <Skeleton className='h-6 w-36 mb-3' />

              {/* Paragraph lines */}
              <div className='space-y-2'>
                {lines.map((w, j) => (
                  <Skeleton key={j} className={`h-4 ${w}`} />
                ))}
              </div>
              <div className='space-y-2 mt-2'>
                {lines.slice(0, 2).map((w, j) => (
                  <Skeleton key={j} className={`h-4 ${w === 'w-full' ? 'w-11/12' : w}`} />
                ))}
              </div>

              {/* Source badges */}
              <div className='flex gap-2 mt-4'>
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className='h-6 w-16 rounded-full' />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
