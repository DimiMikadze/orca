'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  LoaderCircle,
  UserSearch,
  Activity,
  BrainCircuit,
  Lightbulb,
  SquareArrowOutUpRight,
} from 'lucide-react';
import type {
  ProfileAnalysis as ProfileAnalysisType,
  CollectedLinkedInData,
  LinkedInApiCredits,
  AnalysisStats,
} from '@/orca-ai/types';
import { LINKEDIN_CREDITS_COOKIE_NAME } from '@/orca-ai/config';
import { ProfileAnalysisResult } from './profile-analysis-result';
import { ProfileAnalysisCollectedDataModal } from './profile-analysis-collected-data-modal';
import { LogoutButton } from '../components/logout-button';
import Particles from '../components/particles';
import { DummyProfileAnalysis, DummyCollectedData } from '../dummy-data';

interface ApiResult {
  analysis: ProfileAnalysisType;
  collectedData: CollectedLinkedInData;
  stats: AnalysisStats;
  credits: LinkedInApiCredits | null;
}

const USE_DUMMY_DATA = false;

export const ProfileAnalysis = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<ApiResult | null>(
    USE_DUMMY_DATA
      ? {
          analysis: DummyProfileAnalysis as ProfileAnalysisType,
          collectedData: DummyCollectedData as CollectedLinkedInData,
          stats: {
            collectDurationMs: 0,
            analysisDurationMs: 0,
            totalDurationMs: 0,
            toolCallCount: 0,
            insightCount: 10,
          },
          credits: null,
        }
      : null,
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalSection, setModalSection] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LINKEDIN_CREDITS_COOKIE_NAME}=([^;]*)`));
    if (match) {
      try {
        const credits = JSON.parse(decodeURIComponent(match[1]));
        console.info(`[credits] ${credits.remaining}/${credits.limit} remaining`);
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPersonalProfile = /linkedin\.com\/in\/[\w-]+\/?/.test(url);
    if (!isPersonalProfile) {
      setError('Please enter a personal LinkedIn profile URL (e.g. linkedin.com/in/username)');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setProgress(null);

    try {
      const res = await fetch('/api/analyze-linkedin-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processLines = (lines: string[]) => {
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
          } else if (line.startsWith('data: ')) {
            const parsed = JSON.parse(line.slice(6));
            if (currentEvent === 'progress') {
              setProgress(parsed.message);
            } else if (currentEvent === 'result') {
              setData(parsed);
              console.log('[orca] Analysis result:', parsed.analysis);
              console.log('[orca] Collected data:', parsed.collectedData);
              console.log('[orca] Stats:', parsed.stats);
              if (parsed.credits) {
                console.info(`[credits] ${parsed.credits.remaining}/${parsed.credits.limit} remaining`);
                const maxAge = 60 * 60 * 24 * 7;
                document.cookie = `${LINKEDIN_CREDITS_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(parsed.credits))}; path=/; max-age=${maxAge}`;
              }
            } else if (currentEvent === 'error') {
              throw new Error(parsed.error);
            }
          }
        }
      };

      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        processLines(lines);
      }

      if (buffer.trim()) {
        processLines(buffer.split('\n'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className='relative min-h-screen'>
      <Particles />

      {/* Header */}
      <header className='relative border-b border-border'>
        <div className='max-w-4xl mx-auto px-8 pr-16 py-4 flex items-center gap-6'>
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/logo-white.png' alt='Orca' className='h-8 shrink-0 hidden sm:block' />

          {/* Input */}
          <form onSubmit={handleSubmit} className='flex-1 w-full min-w-0'>
            <div className='relative flex items-center bg-background-light border border-border rounded-full px-3 py-2'>
              <input
                type='text'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='Enter LinkedIn profile URL'
                className='flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-secondary focus:outline-none py-2'
              />
              <button
                type='submit'
                disabled={loading || !url}
                className='ml-3 bg-black text-white rounded-full p-2.5 disabled:cursor-not-allowed  transition-all shrink-0 cursor-pointer'
              >
                <Search className='w-4 h-4' />
              </button>
            </div>
          </form>
        </div>

        <div className='absolute right-6 top-1/2 -translate-y-1/2'>
          <LogoutButton />
        </div>

        {/* Error Message */}
        <div className='max-w-4xl mx-auto px-8 text-center'>
          {error && !loading && <p className='text-error mb-4 text-sm'>{error}</p>}
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-8 py-6 pb-12'>
        {/* How it works */}
        {!data && !loading && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 py-16'>
            {[
              { icon: UserSearch, title: 'Enter Profile', description: 'Paste any personal LinkedIn profile URL.' },
              {
                icon: Activity,
                title: 'Collect Activity',
                description: 'Collects posts, comments, reactions, and engagement.',
              },
              {
                icon: BrainCircuit,
                title: 'Analysis',
                description: 'Agent processes activity to extract structured insights.',
              },
              {
                icon: Lightbulb,
                title: 'Discover Insights',
                description: 'Uncover pain points, values, hidden interests, and more.',
              },
            ].map((step, i) => (
              <div key={i} className='flex flex-col items-center text-center'>
                <div className='bg-background-light rounded-xl p-3 mb-4'>
                  <step.icon className='w-6 h-6 text-accent' />
                </div>
                <h3 className='text-md font-semibold text-foreground mb-1'>
                  {i + 1}. {step.title}
                </h3>
                <p className='text-sm text-foreground-secondary'>{step.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading Progress */}
        {loading && (
          <div className='flex items-center gap-3 text-white'>
            <LoaderCircle className='w-4 h-4 animate-spin' />
            <p>{progress ?? 'Starting...'}</p>
          </div>
        )}

        {data && !loading && (
          <div className='mt-2'>
            <div className='flex items-center gap-2 mb-6 flex-wrap'>
              <span className='text-xs text-white'>Analysis based on</span>
              {[
                `${data.collectedData.posts.length} posts`,
                `${data.collectedData.comments.length} comments`,
                `${data.collectedData.reactions.length} reactions`,
                ...(() => {
                  const engagementCount = data.collectedData.topPostsEngagement.reduce(
                    (sum, tpe) => sum + tpe.comments.length + tpe.reactions.length,
                    0,
                  );
                  return engagementCount > 0 ? [`${engagementCount} audience engagements`] : [];
                })(),
              ].map((label) => (
                <span
                  key={label}
                  className='text-xs text-foreground-secondary bg-background-light border border-border rounded-full px-2.5 py-1'
                >
                  {label}
                </span>
              ))}
              <span className='flex items-center gap-1'>
                <button
                  onClick={() => setModalSection('profile')}
                  className='flex items-center text-xs text-foreground-secondary bg-transparent underline rounded-full p-1.5 hover:text-accent hover:border-accent transition-colors cursor-pointer'
                >
                  View Raw Data
                  <SquareArrowOutUpRight className='w-3 h-3 ml-1' />
                </button>
              </span>
            </div>
            <ProfileAnalysisResult analysis={data.analysis} profile={data.collectedData.profile} />
          </div>
        )}

        {data && modalSection !== null && (
          <ProfileAnalysisCollectedDataModal
            data={data.collectedData}
            activeSection={modalSection as 'profile' | 'posts' | 'comments' | 'reactions' | 'engagement'}
            onSectionChange={setModalSection}
            onClose={() => setModalSection(null)}
          />
        )}
      </div>
    </div>
  );
};
