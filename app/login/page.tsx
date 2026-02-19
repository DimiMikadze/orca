import LoginForm from './login-form';
import { Metadata } from 'next';
import { getAuth, protectedAuthPage } from '../supabase/auth';

export const metadata: Metadata = {
  title: 'Login - Orca',
};

export default async function LoginPage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { status } = await getAuth();
    protectedAuthPage(status);
  }

  return <LoginForm />;
}
