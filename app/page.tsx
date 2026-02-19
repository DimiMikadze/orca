import { ProfileAnalysis } from './profile-analysis/profile-analysis';
import { getAuth, protectDashboardPage } from './supabase/auth';

export default async function Home() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { status } = await getAuth();
    protectDashboardPage(status);
  }

  return <ProfileAnalysis />;
}
