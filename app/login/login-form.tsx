'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createSupabaseClient } from '../supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className='relative min-h-screen px-8'>
      {/* Particles */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl' />
        <div className='absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-accent/5 blur-3xl' />
        <div className='absolute -left-20 top-2/3 h-48 w-48 rounded-full bg-accent/3 blur-2xl' />
        <div className='absolute -right-24 top-3/4 h-56 w-56 rounded-full bg-accent/3 blur-2xl' />
        <div className='absolute -left-40 top-[10%] h-72 w-72 rounded-full bg-foreground/2 blur-3xl' />
        <div className='absolute -right-40 top-[60%] h-72 w-72 rounded-full bg-foreground/2 blur-3xl' />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');

          const form = new FormData(e.currentTarget);
          const { error } = await createSupabaseClient().auth.signInWithPassword({
            email: form.get('email') as string,
            password: form.get('password') as string,
          });

          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }

          router.push('/');
        }}
        className='p-6 py-8 mt-8 rounded-md max-w-md bg-card border border-border mx-auto'
      >
        <div className='flex flex-col items-center mb-8'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/logo-white.png' alt='Orca Logo' className='h-10 w-auto shrink-0' />
        </div>

        <div className='mb-4'>
          <Label htmlFor='email'>Email</Label>
          <input
            id='email'
            name='email'
            type='email'
            required
            className='bg-input mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground'
          />
        </div>

        <div className='mb-4'>
          <Label htmlFor='password'>Password</Label>
          <input
            id='password'
            name='password'
            type='password'
            required
            className='bg-input mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground'
          />
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type='submit'
          disabled={loading}
          className='mt-4 w-full cursor-pointer'
        >
          {loading && <Loader2 className='animate-spin' />}
          {loading ? 'Signing in…' : 'Log in'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
