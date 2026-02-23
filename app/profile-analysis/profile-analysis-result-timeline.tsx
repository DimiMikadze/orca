'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { X, MoveUpRight } from 'lucide-react';
import type { CollectedLinkedInData, LinkedInPost } from '@/orca-ai/types';

interface ProfileAnalysisResultTimelineProps {
  collectedData: CollectedLinkedInData;
}

const POST_COLOR = '#0084ff';
const COMMENT_COLOR = '#f59e0b';
const REACTION_COLOR = '#22c55e';

const LANE_HEIGHT = 120;
const DOT = 12;
const JITTER_STEP = DOT + 3;
/** Minimum px per month column. Below this the chart scrolls horizontally. */
const MIN_MONTH_WIDTH = 60;

const LANES = [
  { key: 'posts' as const, label: 'Posts', color: POST_COLOR },
  { key: 'comments' as const, label: 'Comments', color: COMMENT_COLOR },
  { key: 'reactions' as const, label: 'Reactions', color: REACTION_COLOR },
];

interface RawItem {
  item: LinkedInPost;
  monthIndex: number;
  dayFraction: number;
}

interface PlotItem {
  item: LinkedInPost;
  xPx: number;
  yPx: number;
}

function formatDate(posted: string): string {
  return new Date(posted.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function jitter(rawItems: RawItem[], monthWidth: number): PlotItem[] {
  const threshold = (3 / 30) * monthWidth; // ~3 days worth of px
  const items = rawItems
    .map((r) => ({ item: r.item, xPx: (r.monthIndex + r.dayFraction) * monthWidth }))
    .sort((a, b) => a.xPx - b.xPx);

  const result: PlotItem[] = [];
  const maxSpread = LANE_HEIGHT - DOT - 4;

  let i = 0;
  while (i < items.length) {
    const group = [items[i]];
    let j = i + 1;
    while (j < items.length && items[j].xPx - items[i].xPx < threshold) {
      group.push(items[j]);
      j++;
    }
    const n = group.length;
    const step = n > 1 ? Math.min(JITTER_STEP, maxSpread / (n - 1)) : 0;
    const totalH = (n - 1) * step;
    group.forEach((el, gi) => {
      result.push({ item: el.item, xPx: el.xPx, yPx: -totalH / 2 + gi * step });
    });
    i = j;
  }

  return result;
}

export const ProfileAnalysisResultTimeline = ({ collectedData }: ProfileAnalysisResultTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ item: LinkedInPost; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<{ item: LinkedInPost; laneLabel: string; color: string } | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScrollWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Month array — no pixel positions yet (those depend on container width)
  const months = useMemo(() => {
    const now = new Date();
    const result: { year: number; month: number; label: string; index: number }[] = [];
    const cur = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    let idx = 0;
    while (
      cur.getFullYear() < now.getFullYear() ||
      (cur.getFullYear() === now.getFullYear() && cur.getMonth() <= now.getMonth())
    ) {
      result.push({ year: cur.getFullYear(), month: cur.getMonth(), label: cur.toLocaleString('default', { month: 'short' }), index: idx });
      idx++;
      cur.setMonth(cur.getMonth() + 1);
    }
    return result;
  }, []);

  // Raw item positions (month index + day fraction) — independent of container width
  const laneRaw = useMemo(() => {
    const toRaw = (items: LinkedInPost[]): RawItem[] =>
      items
        .filter((item) => item.posted)
        .flatMap((item) => {
          const d = new Date(item.posted!.slice(0, 10) + 'T00:00:00');
          const mi = months.findIndex((m) => m.year === d.getFullYear() && m.month === d.getMonth());
          if (mi === -1) return [];
          const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          return [{ item, monthIndex: mi, dayFraction: (d.getDate() - 1) / daysInMonth }];
        });

    return {
      posts: toRaw(collectedData.posts),
      comments: toRaw(collectedData.comments),
      reactions: toRaw(collectedData.reactions),
    };
  }, [collectedData, months]);

  const innerWidth = scrollWidth > 0 ? Math.max(scrollWidth, months.length * MIN_MONTH_WIDTH) : months.length * MIN_MONTH_WIDTH;
  const monthWidth = months.length > 0 ? innerWidth / months.length : MIN_MONTH_WIDTH;

  // Pixel-positioned plot items (recalculated when monthWidth changes)
  const lanes = useMemo(() => {
    if (scrollWidth === 0) return { posts: [], comments: [], reactions: [] as PlotItem[] };
    return {
      posts: jitter(laneRaw.posts, monthWidth),
      comments: jitter(laneRaw.comments, monthWidth),
      reactions: jitter(laneRaw.reactions, monthWidth),
    };
  }, [laneRaw, monthWidth, scrollWidth]);

  return (
    <div className='pt-2'>
      <div className='flex'>
        {/* Scrollable chart column */}
        <div className='flex-1 min-w-0 overflow-x-auto' ref={scrollRef}>
          <div className='relative' style={{ width: innerWidth }}>
            {/* Month column dividers */}
            {months.map(({ year, month, index }) => (
              <div
                key={`${year}-${month}`}
                className='absolute top-0 pointer-events-none'
                style={{
                  left: index * monthWidth,
                  height: LANE_HEIGHT * LANES.length,
                  width: 1,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              />
            ))}

            {/* Lanes */}
            {LANES.map(({ key, color }, li) => (
              <div
                key={key}
                className='relative'
                style={{
                  height: LANE_HEIGHT,
                  backgroundColor: color + '0a',
                  borderTop: li > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                }}
              >
                {/* Center track line */}
                <div
                  className='absolute inset-x-0 top-1/2 -translate-y-px'
                  style={{ height: 1, backgroundColor: color + '25' }}
                />

                {/* Dots */}
                {lanes[key].map(({ item, xPx, yPx }, i) => (
                  <div
                    key={i}
                    className='absolute cursor-pointer rounded-full transition-transform hover:scale-150'
                    style={{
                      width: DOT,
                      height: DOT,
                      backgroundColor: color,
                      left: xPx,
                      top: `calc(50% + ${yPx}px)`,
                      transform: 'translateX(-50%) translateY(-50%)',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => setTooltip({ item, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() =>
                      setSelected(
                        selected?.item === item
                          ? null
                          : { item, laneLabel: LANES.find((l) => l.key === key)!.label, color },
                      )
                    }
                  />
                ))}
              </div>
            ))}

            {/* Month axis */}
            <div className='relative h-6 mt-1'>
              {months.map(({ year, month, label, index }) => (
                <span
                  key={`${year}-${month}`}
                  className='absolute text-xs text-foreground-secondary/50'
                  style={{ left: index * monthWidth }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='flex items-center gap-5 mt-3'>
        {LANES.map(({ key, label, color }) => (
          <div key={key} className='flex items-center gap-1.5'>
            <div className='rounded-full' style={{ width: DOT, height: DOT, backgroundColor: color }} />
            <span className='text-xs text-foreground-secondary'>{label}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className='mt-6 border border-border rounded-xl p-4'>
          <div className='flex items-start justify-between gap-4 mb-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span
                className='text-xs font-medium px-1.5 py-0.5 rounded shrink-0'
                style={{ backgroundColor: selected.color + '22', color: selected.color }}
              >
                {selected.laneLabel}
              </span>
              {selected.item.posted && (
                <span className='text-xs text-foreground-secondary'>{formatDate(selected.item.posted)}</span>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className='shrink-0 text-foreground-secondary hover:text-foreground cursor-pointer'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
          <p className='text-sm text-foreground-secondary leading-relaxed'>{selected.item.text ?? '—'}</p>
          {selected.item.post_url && (
            <a
              href={selected.item.post_url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline'
            >
              View source <MoveUpRight className='w-3 h-3' />
            </a>
          )}
        </div>
      )}

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className='fixed z-50 pointer-events-none bg-background-light border border-border rounded-lg px-3 py-2 max-w-64'
          style={{ left: tooltip.x + 14, top: tooltip.y - 80 }}
        >
          {tooltip.item.posted && (
            <p className='text-xs font-medium text-foreground mb-1'>{formatDate(tooltip.item.posted)}</p>
          )}
          <p className='text-xs text-foreground-secondary line-clamp-3'>{tooltip.item.text ?? '—'}</p>
        </div>
      )}
    </div>
  );
};
