import { SupabaseClient, User } from '@supabase/supabase-js';
import { Tables } from './database.types';

//=========================
// Auth
//=========================
export async function getAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

//=========================
// Analysis
//=========================

// Maximum number of analyses a user can run
export const ANALYSIS_CAP = 50;

export async function insertAnalysis(supabase: SupabaseClient, userId: string, profileUrl: string): Promise<void> {
  await supabase.from('analysis').insert({ user_id: userId, profile_url: profileUrl });
}

export async function getAnalyses(supabase: SupabaseClient, userId: string): Promise<Tables<'analysis'>[]> {
  const { data } = await supabase
    .from('analysis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getAnalysisCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count } = await supabase.from('analysis').select('*', { count: 'exact', head: true }).eq('user_id', userId);

  return count ?? 0;
}
