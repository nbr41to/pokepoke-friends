'use server';

import prisma from '@/libs/prisma/client';
import { createClient } from '@/libs/supabase/server';
import { revalidatePath } from 'next/cache';
import { schema } from './schema';

export const upsertPlayer = async (player: {
  friendId: string;
  playerName: string;
  secretWord?: string;
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const parsedParams = schema.safeParse(player);
  if (!parsedParams.success) {
    throw new Error(
      `Validation error: ${parsedParams.error.errors.map((e) => e.message).join(', ')}`,
    );
  }
  const result = await prisma.player.upsert({
    where: { id: user.id },
    update: {
      friendId: parsedParams.data.friendId,
      playerName: parsedParams.data.playerName,
      secretWord: parsedParams.data.secretWord,
    },
    create: {
      id: user.id,
      friendId: parsedParams.data.friendId,
      playerName: parsedParams.data.playerName,
      secretWord: parsedParams.data.secretWord,
    },
  });

  revalidatePath('/setting');

  return result;
};
