import { createClient } from './client';

/**
 * Googleログインを開始する関数
 */
export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) throw error;
};
