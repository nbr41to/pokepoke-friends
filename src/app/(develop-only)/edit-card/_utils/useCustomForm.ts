'use client';

import type { Card } from '@/generated/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import type { z } from 'zod';
import { schema } from './schema';

export const useCustomForm = (card: Card) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    defaultValues: {
      id: card.id,
      name: card.name,
      rarity: card.rarity,
      image: card.image,
      cardType: card.cardType,
      numbering: card.numbering,
      packName: card.packName || '',
      description: card.description || '',
      // hp: card.hp?.toString() || '',
      type: card.type,
      evolveStage: card.evolveStage,
      move1name: card.move1name || '',
      move1power: card.move1power || '',
      move1energy: card.move1energy || '',
      move1description: card.move1description || '',
      move2name: card.move2name || '',
      move2power: card.move2power || '',
      move2energy: card.move2energy || '',
      move2description: card.move2description || '',
      abilityName: card.abilityName || '',
      abilityDescription: card.abilityDescription || '',
      retreat: card.retreat,
      weakness: card.weakness,
    },
    resolver: zodResolver(schema),
  });
};

export const useCustomFormContext = () =>
  useFormContext<z.infer<typeof schema>>();
