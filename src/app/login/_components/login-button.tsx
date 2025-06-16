'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from './action';

export function LoginButton({ redirectUrl }: { redirectUrl?: string }) {
  return (
    <Button
      className="font-hachiMaru fixed top-2 right-2 size-9 w-auto rounded-full font-bold md:relative md:top-auto md:right-auto md:rounded-md md:pt-1"
      onClick={async () => {
        try {
          await signInWithGoogle(redirectUrl);
        } catch (e) {
          alert('Googleログインに失敗しました');
        }
      }}
    >
      <LogIn className="md:mt-1" />
      <span className="hidden md:block">ログインする</span>
    </Button>
  );
}
