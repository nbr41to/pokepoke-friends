'use client';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/libs/supabase/auth';

export function LoginButton() {
  return (
    <Button
      onClick={async () => {
        try {
          await signInWithGoogle();
        } catch (e) {
          alert('Googleログインに失敗しました');
        }
      }}
    >
      ログインする
    </Button>
  );
}
