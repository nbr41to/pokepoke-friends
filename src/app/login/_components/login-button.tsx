'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from './action';

export function LoginButton({ redirectUrl }: { redirectUrl?: string }) {
  return (
    <Button
      className="font-hachiMaru pt-1"
      onClick={async () => {
        try {
          await signInWithGoogle(redirectUrl);
        } catch (e) {
          alert('Googleログインに失敗しました');
        }
      }}
    >
      <LogIn className="mt-1" />
      <span className="font-bold">ログインする</span>
    </Button>
  );
}
