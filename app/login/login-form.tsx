'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '../supabase/client';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className='relative min-h-screen'>
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
        className='p-6 py-8 mt-8 rounded-md max-w-md bg-gray-100 mx-auto'
      >
        <div className='flex flex-col items-center mb-8'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/logo-black.png' alt='Orca Logo' className='hidden sm:block h-10 w-auto shrink-0' />
        </div>

        <div className='mb-4'>
          <label htmlFor='email' className='text-sm font-medium text-gray-900'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            required
            className='bg-white mt-2 w-full rounded-xl border px-3 py-2 text-sm text-gray-900'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className='text-sm font-medium text-gray-900'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            required
            className='bg-white mt-2 w-full rounded-xl border px-3 py-2 text-sm text-gray-900'
          />
        </div>

        {error && <p className='mb-4 text-red-600 text-sm'>{error}</p>}

        <button
          type='submit'
          disabled={loading}
          className='cursor-pointer mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-50'
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
