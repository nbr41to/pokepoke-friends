'use server';

import prisma from '@/libs/prisma/client';
import { revalidatePath } from 'next/cache';

export const addTagSelectedCards = async (cardIds: string[], tag: string) => {
  const results = await prisma.card.updateMany({
    where: {
      id: {
        in: cardIds,
      },
    },
    data: {
      tags: {
        push: tag,
      },
    },
  });

  revalidatePath('/edit/cards');

  return results;
};

export const removeTagSelectedCards = async (
  cardIds: string[],
  tag: string,
) => {
  const results: string[] = [];

  for (const cardId of cardIds) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });
    if (!card) continue;
    const updatedTags = card.tags.filter((t) => t !== tag);
    const result = await prisma.card.update({
      where: { id: cardId },
      data: { tags: updatedTags },
    });
    results.push(result.id);
  }

  revalidatePath('/edit/cards');

  return results;
};
