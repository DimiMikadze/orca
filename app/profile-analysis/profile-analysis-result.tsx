import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ProfileAnalysis, LinkedInProfile } from '@/orca-ai/types';
import { Badge } from '@/components/ui/badge';

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

const resolveHref = (raw: string): string => {
  if (raw.startsWith('http')) return raw;
  // LinkedIn member IDs like ACoAADkodFgB...
  if (raw.startsWith('ACoAA')) return `https://www.linkedin.com/in/${raw}`;
  return raw;
};

const isPostUrl = (url: string): boolean => {
  try {
    const { pathname } = new URL(url);
    return pathname.includes('/feed/update/') || pathname.includes('/posts/');
  } catch {
    return false;
  }
};

/** Extracts post links as numbered source chips; leaves person links as inline markdown links. */
const extractLinks = (content: string): { prose: string; links: { label: string; url: string }[] } => {
  const links: { label: string; url: string }[] = [];
  const seenUrls = new Set<string>();
  let postCount = 0;

  const prose = content.replace(MARKDOWN_LINK_REGEX, (_, label, url) => {
    const resolved = resolveHref(url);
    if (isPostUrl(resolved)) {
      if (!seenUrls.has(resolved)) {
        seenUrls.add(resolved);
        links.push({ label: `post ${++postCount}`, url: resolved });
      }
      return ''; // remove post reference entirely from prose
    }
    return `[${label}](${url})`; // keep person links intact for ReactMarkdown
  });

  return { prose, links };
};

interface ProfileAnalysisResultProps {
  analysis: ProfileAnalysis;
  profile: LinkedInProfile;
}

export const ProfileAnalysisResult = ({ analysis, profile }: ProfileAnalysisResultProps) => {
  return (
    <div>
      <div className='mb-10 flex items-center gap-5'>
        {profile.profile_image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
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

      <div className='space-y-8'>
        {analysis.insights.map((insight, i) => {
          const { prose, links } = extractLinks(insight.content);
          return (
            <div key={i}>
              <h3 className='text-lg font-semibold text-foreground mb-2'>{insight.name}</h3>
              <div className='text-sm leading-relaxed text-foreground-secondary [&_p]:my-1.5'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={resolveHref(href ?? '')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline rounded px-1 py-0.5 hover:text-primary transition-colors'
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {prose}
                </ReactMarkdown>
              </div>
              {links.length > 0 && (
                <div className='mt-3'>
                  <div className='flex flex-wrap gap-1.5 mt-1.5'>
                    <span className='text-xs text-foreground-secondary/40 tracking-wide mr-2 mt-0.5'>Sources</span>
                    {links.map((link, j) => (
                      <Badge key={j} asChild variant='outline'>
                        <a href={link.url} target='_blank' rel='noopener noreferrer'>
                          ↗ {link.label}
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
