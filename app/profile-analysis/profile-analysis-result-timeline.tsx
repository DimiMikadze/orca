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

const LANE_LABEL_W = 80;
const LANE_HEIGHT = 120;
const DOT = 12;
const JITTER_THRESHOLD_PCT = 1.5; // group dots within this % of each other
const JITTER_STEP = DOT + 3;

const LANES = [
  { key: 'posts' as const, label: 'Posts', color: POST_COLOR },
  { key: 'comments' as const, label: 'Comments', color: COMMENT_COLOR },
  { key: 'reactions' as const, label: 'Reactions', color: REACTION_COLOR },
];

interface PlotItem {
  item: LinkedInPost;
  pct: number;
  yPx: number;
}

function formatDate(posted: string): string {
  return new Date(posted.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Distributes overlapping dots vertically so they don't pile on top of each other.
 *  When a group is too large to fit with full spacing, the step compresses so dots
 *  always stay within the lane bounds. */
function jitter(items: { item: LinkedInPost; pct: number }[]): PlotItem[] {
  const sorted = [...items].sort((a, b) => a.pct - b.pct);
  const result: PlotItem[] = [];
  const maxSpread = LANE_HEIGHT - DOT - 4; // max total vertical spread to stay in-lane

  let i = 0;
  while (i < sorted.length) {
    const group: typeof sorted = [sorted[i]];
    let j = i + 1;
    while (j < sorted.length && sorted[j].pct - sorted[i].pct < JITTER_THRESHOLD_PCT) {
      group.push(sorted[j]);
      j++;
    }
    const n = group.length;
    const step = n > 1 ? Math.min(JITTER_STEP, maxSpread / (n - 1)) : 0;
    const totalH = (n - 1) * step;
    group.forEach((el, gi) => {
      result.push({ ...el, yPx: -totalH / 2 + gi * step });
    });
    i = j;
  }

  return result;
}

export const ProfileAnalysisResultTimeline = ({ collectedData }: ProfileAnalysisResultTimelineProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ item: LinkedInPost; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<{ item: LinkedInPost; laneLabel: string; color: string } | null>(null);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setChartWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { monthTicks, lanes } = useMemo(() => {
    const now = new Date();
    // Start on the 1st of the month exactly 12 months ago so the first month label is always visible at position 0
    const rangeStart = new Date(now.getFullYear() - 1, now.getMonth(), 1, 0, 0, 0, 0);
    const rangeEnd = new Date(now);
    rangeEnd.setHours(23, 59, 59, 999);
    const rangeMs = rangeEnd.getTime() - rangeStart.getTime();

    const monthTicks: { key: string; label: string; pct: number }[] = [];
    const cur = new Date(rangeStart);
    while (cur <= rangeEnd) {
      monthTicks.push({
        key: `${cur.getFullYear()}-${cur.getMonth()}`,
        label: cur.toLocaleString('default', { month: 'short' }),
        pct: ((cur.getTime() - rangeStart.getTime()) / rangeMs) * 100,
      });
      cur.setMonth(cur.getMonth() + 1);
    }

    const toPlotItems = (items: LinkedInPost[]) =>
      items
        .filter((item) => item.posted)
        .map((item) => {
          const t = new Date(item.posted!.slice(0, 10) + 'T00:00:00').getTime();
          const pct = ((t - rangeStart.getTime()) / rangeMs) * 100;
          return { item, pct };
        })
        .filter(({ pct }) => pct >= 0 && pct <= 100);

    return {
      monthTicks,
      lanes: {
        posts: jitter(toPlotItems(collectedData.posts)),
        comments: jitter(toPlotItems(collectedData.comments)),
        reactions: jitter(toPlotItems(collectedData.reactions)),
      },
    };
  }, [collectedData]);

  return (
    <div className='pt-2'>
      <div className='flex'>
        {/* Lane labels */}
        <div className='shrink-0 flex flex-col' style={{ width: LANE_LABEL_W }}>
          {LANES.map(({ key, label, color }) => (
            <div key={key} className='flex items-center justify-end pr-4' style={{ height: LANE_HEIGHT }}>
              <span className='text-xs font-medium' style={{ color }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className='flex-1 min-w-0 relative' ref={chartRef}>
          {/* Month gridlines — rendered behind all lanes */}
          {chartWidth > 0 &&
            monthTicks.map(({ key, pct }) => (
              <div
                key={key}
                className='absolute top-0 pointer-events-none'
                style={{
                  left: `${pct}%`,
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
              {chartWidth > 0 &&
                lanes[key].map(({ item, pct, yPx }, i) => (
                  <div
                    key={i}
                    className='absolute cursor-pointer rounded-full transition-transform hover:scale-150'
                    style={{
                      width: DOT,
                      height: DOT,
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}99`,
                      left: `${pct}%`,
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
            {monthTicks.map(({ key, label, pct }) => (
              <span
                key={key}
                className='absolute text-xs text-foreground-secondary/50 -translate-x-1/2'
                style={{ left: `${pct}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
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
