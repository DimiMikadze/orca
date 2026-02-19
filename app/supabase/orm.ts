import { SupabaseClient, User } from '@supabase/supabase-js';

//=========================
// Auth
//=========================
export async function getAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
