'use server';

import prisma from '@/libs/prisma/client';
import { revalidatePath } from 'next/cache';

export const insertCard = async (params: any) => {
  try {
    const result = await prisma.card.upsert({
      where: {
        id: params.id,
      },
      update: params,
      create: params,
    });

    revalidatePath('/acquisition');

    return result;
  } catch (error) {
    console.error('Error inserting card: ', error);

    return null;
  }
};

export const upsertCards = async (params: any) => {
  try {
    console.info('Start upserting cards: ', params.length);
    const results = [];
    for (const card of params) {
      const result = await prisma.card.upsert({
        where: {
          id: card.id,
        },
        update: card,
        create: card,
      });
      results.push(result.id);
    }
    console.info('Upserted cards: ', results.length);

    revalidatePath('/acquisition');

    return results;
  } catch (error) {
    console.error('Error upserting cards: ', error);

    return null;
  }
};
