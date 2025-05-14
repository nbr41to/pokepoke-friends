'use server';

import type { Card } from '@/generated/prisma';
import prisma from '@/libs/prisma/client';
import { schema } from './_utils/schema';

export const updateCard = async (prev: Card | null, formData: FormData) => {
  const id = formData.get('id')?.toString();
  const name = formData.get('name');
  const rarity = formData.get('rarity');
  const image = formData.get('image');
  const cardType = formData.get('cardType');
  const numbering = formData.get('numbering');
  const packName = formData.get('packName') || null;
  const description = formData.get('description') || null;
  const hp = Number(formData.get('hp')) || null;
  const type = formData.get('type') || null;
  const evolveStage = formData.get('evolveStage') || null;
  const move1name = formData.get('move1name') || null;
  const move1power = formData.get('move1power') || null;
  const move1energy = formData.get('move1energy');
  const move1description = formData.get('move1description') || null;
  const move2name = formData.get('move2name') || null;
  const move2power = formData.get('move2power') || null;
  const move2energy = formData.get('move2energy') || null;
  const move2description = formData.get('move2description') || null;
  const abilityName = formData.get('abilityName') || null;
  const abilityDescription = formData.get('abilityDescription') || null;
  const retreat = Number(formData.get('retreat')) || null;
  const weakness = formData.get('weakness') || null;

  try {
    // バリデーション
    const parsedParams = schema.parse({
      id,
      name,
      rarity,
      image,
      cardType,
      numbering,
      packName,
      description,
      hp,
      type,
      evolveStage,
      move1name,
      move1power,
      move1energy,
      move1description,
      move2name,
      move2power,
      move2energy,
      move2description,
      abilityName,
      abilityDescription,
      retreat,
      weakness,
    });

    // DBに登録
    const result = await prisma.card.update({
      where: { id },
      data: parsedParams,
    });

    return result;
  } catch (error) {
    console.error('Error updating card:', error);

    return null;
  }
};
