import { User } from '@supabase/supabase-js';
import { getAuthUser } from './orm';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './server';

interface getAuthPayload {
  authUser: User | null;
  status: AuthStatus;
}

type AuthStatus = 'UNAUTHENTICATED' | 'AUTHENTICATED';

export async function getAuth(): Promise<getAuthPayload> {
  const supabase = await createSupabaseServerClient();
  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return {
      authUser: null,
      status: 'UNAUTHENTICATED',
    };
  }

  return {
    authUser,
    status: 'AUTHENTICATED',
  };
}

export const protectDashboardPage = (status: AuthStatus) => {
  switch (status) {
    case 'UNAUTHENTICATED':
      redirect('/login');
    default:
  }
};

export const protectedAuthPage = (status: AuthStatus) => {
  switch (status) {
    case 'AUTHENTICATED':
      redirect('/');
    default:
  }
};
