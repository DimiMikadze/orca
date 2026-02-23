'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { X, MoveUpRight } from 'lucide-react';
import type { CollectedLinkedInData, LinkedInPost } from '@/orca-ai/types';

interface ProfileAnalysisResultHeatmapProps {
  collectedData: CollectedLinkedInData;
}

interface DayActivity {
  posts: LinkedInPost[];
  comments: LinkedInPost[];
  reactions: LinkedInPost[];
}

const GAP = 2;
const DAY_LABEL_W = 36;
const MAX_CELL = 18;
const MIN_CELL = 7;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHOW_LABEL = [false, true, false, true, false, true, false];

const POST_COLOR = '#0084ff';
const COMMENT_COLOR = '#f59e0b';
const REACTION_COLOR = '#22c55e';
const EMPTY_COLOR = '#2c2d2e';

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parsePosted(posted: string): string {
  return posted.slice(0, 10);
}

function cellStyle(activity: DayActivity | undefined, cell: number): React.CSSProperties {
  const base = { width: cell, height: cell };
  if (!activity) return { ...base, backgroundColor: EMPTY_COLOR };
  const total = activity.posts.length + activity.comments.length + activity.reactions.length;
  if (total === 0) return { ...base, backgroundColor: EMPTY_COLOR };

  let color: string;
  let count: number;
  if (activity.posts.length > 0) {
    color = POST_COLOR;
    count = activity.posts.length;
  } else if (activity.comments.length > 0) {
    color = COMMENT_COLOR;
    count = activity.comments.length;
  } else {
    color = REACTION_COLOR;
    count = activity.reactions.length;
  }

  const opacity = Math.min(0.35 + count * 0.25, 1);
  return { ...base, backgroundColor: color, opacity };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const ProfileAnalysisResultHeatmap = ({ collectedData }: ProfileAnalysisResultHeatmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ date: string; counts: { posts: number; comments: number; reactions: number }; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<{ date: string; activity: DayActivity } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { activityMap, weeks, monthLabels } = useMemo(() => {
    const map = new Map<string, DayActivity>();

    const ensure = (date: string): DayActivity => {
      if (!map.has(date)) map.set(date, { posts: [], comments: [], reactions: [] });
      return map.get(date)!;
    };

    for (const post of collectedData.posts) {
      if (post.posted) ensure(parsePosted(post.posted)).posts.push(post);
    }
    for (const comment of collectedData.comments) {
      if (comment.posted) ensure(parsePosted(comment.posted)).comments.push(comment);
    }
    for (const reaction of collectedData.reactions) {
      if (reaction.posted) ensure(parsePosted(reaction.posted)).reactions.push(reaction);
    }

    // Always show exactly the last 12 months ending today
    const end = new Date();
    end.setDate(end.getDate() + (6 - end.getDay())); // pad forward to Saturday

    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() - start.getDay()); // pad back to Sunday

    const weeks: string[][] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];
    const cur = new Date(start);
    let lastMonth = -1;
    let lastLabelWeekIndex = -4;

    while (cur <= end) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        const month = cur.getMonth();
        if (d === 0 && month !== lastMonth && weeks.length - lastLabelWeekIndex >= 3) {
          monthLabels.push({ label: cur.toLocaleString('default', { month: 'short' }), weekIndex: weeks.length });
          lastLabelWeekIndex = weeks.length;
          lastMonth = month;
        }
        week.push(toDateStr(cur));
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    return { activityMap: map, weeks, monthLabels };
  }, [collectedData]);

  const cell = useMemo(() => {
    if (!containerWidth || !weeks.length) return MIN_CELL;
    const available = containerWidth - DAY_LABEL_W - GAP * (weeks.length - 1);
    return Math.min(Math.max(Math.floor(available / weeks.length), MIN_CELL), MAX_CELL);
  }, [containerWidth, weeks.length]);

  const step = cell + GAP;

return (
    <div className='pt-2' ref={containerRef}>
      <div className='flex w-full'>
        {/* Day labels */}
        <div className='flex flex-col pt-5 pr-2 shrink-0' style={{ width: DAY_LABEL_W, gap: GAP }}>
          {DAY_NAMES.map((name, i) => (
            <div
              key={i}
              className='text-xs text-foreground-secondary/50'
              style={{ height: cell, lineHeight: `${cell}px`, visibility: SHOW_LABEL[i] ? 'visible' : 'hidden' }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Grid + month labels */}
        <div className='flex-1 min-w-0'>
          {/* Month labels */}
          <div className='relative h-5'>
            {monthLabels.map(({ label, weekIndex }) => (
              <span
                key={`${label}-${weekIndex}`}
                className='absolute text-xs text-foreground-secondary/60'
                style={{ left: weekIndex * step }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className='flex' style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className='flex flex-col' style={{ gap: GAP }}>
                {week.map((date, di) => {
                  const activity = activityMap.get(date);
                  const hasActivity = activity && (activity.posts.length + activity.comments.length + activity.reactions.length) > 0;
                  return (
                    <div
                      key={di}
                      className={`rounded-sm transition-transform ${hasActivity ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
                      style={cellStyle(activity, cell)}
                      onMouseEnter={(e) => {
                        setTooltip({
                          date,
                          counts: {
                            posts: activity?.posts.length ?? 0,
                            comments: activity?.comments.length ?? 0,
                            reactions: activity?.reactions.length ?? 0,
                          },
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => {
                        if (!hasActivity) return;
                        setSelected(selected?.date === date ? null : { date, activity: activity! });
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='flex items-center gap-5 mt-4' style={{ marginLeft: DAY_LABEL_W }}>
        {[
          { label: 'Post', color: POST_COLOR },
          { label: 'Comment', color: COMMENT_COLOR },
          { label: 'Reaction', color: REACTION_COLOR },
        ].map(({ label, color }) => (
          <div key={label} className='flex items-center gap-1.5'>
            <div className='rounded-sm' style={{ width: cell, height: cell, backgroundColor: color }} />
            <span className='text-xs text-foreground-secondary'>{label}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className='mt-6 border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm font-medium text-foreground'>{formatDate(selected.date)}</p>
            <button onClick={() => setSelected(null)} className='text-foreground-secondary hover:text-foreground cursor-pointer'>
              <X className='w-4 h-4' />
            </button>
          </div>
          <div className='space-y-3'>
            {[
              { items: selected.activity.posts, type: 'Post', color: POST_COLOR },
              { items: selected.activity.comments, type: 'Comment', color: COMMENT_COLOR },
              { items: selected.activity.reactions, type: 'Reaction', color: REACTION_COLOR },
            ].flatMap(({ items, type, color }) =>
              items.map((item, i) => (
                <div key={`${type}-${i}`} className='flex items-start gap-3'>
                  <span
                    className='shrink-0 text-xs font-medium px-1.5 py-0.5 rounded mt-0.5'
                    style={{ backgroundColor: color + '22', color }}
                  >
                    {type}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-foreground-secondary line-clamp-2'>
                      {item.text ?? '—'}
                    </p>
                  </div>
                  {item.post_url && (
                    <a
                      href={item.post_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='shrink-0 text-foreground-secondary hover:text-primary transition-colors mt-0.5'
                    >
                      <MoveUpRight className='w-3.5 h-3.5' />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className='fixed z-50 pointer-events-none bg-background-light border border-border rounded-lg px-3 py-2'
          style={{ left: tooltip.x + 14, top: tooltip.y - 70 }}
        >
          <p className='text-xs font-medium text-foreground mb-1'>
            {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          {tooltip.counts.posts + tooltip.counts.comments + tooltip.counts.reactions === 0 ? (
            <p className='text-xs text-foreground-secondary'>No activity</p>
          ) : (
            <div className='space-y-0.5'>
              {tooltip.counts.posts > 0 && (
                <p className='text-xs text-foreground-secondary'>{tooltip.counts.posts} post{tooltip.counts.posts > 1 ? 's' : ''}</p>
              )}
              {tooltip.counts.comments > 0 && (
                <p className='text-xs text-foreground-secondary'>{tooltip.counts.comments} comment{tooltip.counts.comments > 1 ? 's' : ''}</p>
              )}
              {tooltip.counts.reactions > 0 && (
                <p className='text-xs text-foreground-secondary'>{tooltip.counts.reactions} reaction{tooltip.counts.reactions > 1 ? 's' : ''}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
