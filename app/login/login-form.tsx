'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createSupabaseClient } from '../supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Particles from '@/app/components/particles';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className='relative min-h-screen px-8'>
      <Particles />

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
          <Input
            id='email'
            name='email'
            type='email'
            required
            className='mt-2'
          />
        </div>

        <div className='mb-4'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            className='mt-2'
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
