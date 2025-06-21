'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signInWithGoogle } from './action';

export function LoginButton() {
  const pathname = usePathname();

  return (
    <Button
      className="fixed top-2 right-2 w-9 rounded-full font-bold md:relative md:top-auto md:right-auto md:w-auto md:rounded-md md:pt-1"
      onClick={async () => {
        try {
          await signInWithGoogle(pathname);
        } catch (e) {
          alert('Googleログインに失敗しました');
        }
      }}
    >
      <LogIn className="md:mt-1" />
      <span className="hidden md:block">ログイン</span>
    </Button>
  );
}
