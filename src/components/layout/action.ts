'use server';

import { createClient } from '@/libs/supabase/server';
import { baseUrl } from '@/utils/url';
import { redirect } from 'next/navigation';

/**
 * Googleログインを開始する関数
 * @param redirectPath ログイン後に戻したいパス（例: '/edit/unregister'）
 */
export const signInWithGoogle = async (redirectUrl: string) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
    },
  });
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};

/**
 * ログアウトする関数
 */
export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
  // Optionally, redirect to a specific page after sign out
  redirect('/'); // Redirect to home or login page
};
