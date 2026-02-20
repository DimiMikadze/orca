'use client';

import { useState } from 'react';
import type { InsightDefinition } from '@/orca-ai/types';
import { DEFAULT_INSIGHTS } from '@/orca-ai/config';

const STORAGE_KEY = 'orca:insights';

const loadFromStorage = (): InsightDefinition[] => {
  if (typeof window === 'undefined') return DEFAULT_INSIGHTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_INSIGHTS;
};

export const useInsights = () => {
  const [insights, setInsightsState] = useState<InsightDefinition[]>(loadFromStorage);

  const saveInsights = (next: InsightDefinition[]) => {
    setInsightsState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  return { insights, saveInsights };
};
