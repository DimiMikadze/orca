'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUser } from 'lucide-react';
import { createSupabaseClient } from '../supabase/client';

export const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  return (
    <div ref={ref} className='relative shrink-0'>
      <button
        onClick={() => setOpen((o) => !o)}
        className='text-foreground-secondary hover:text-foreground transition-colors cursor-pointer'
      >
        <CircleUser className='w-4 h-4' />
      </button>

      {open && (
        <div className='absolute right-0 top-full mt-2 w-36 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50'>
          <button
            onClick={async () => {
              await createSupabaseClient().auth.signOut();
              router.push('/login');
            }}
            className='w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 cursor-pointer'
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};
