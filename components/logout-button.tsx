'use client';

import { useRouter } from 'next/navigation';
import { CircleUser } from 'lucide-react';
import { createSupabaseClient } from '../app/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LogoutButton = () => {
  const router = useRouter();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='text-foreground-secondary cursor-pointer'>
          <CircleUser className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={async () => {
            await createSupabaseClient().auth.signOut();
            router.push('/login');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
