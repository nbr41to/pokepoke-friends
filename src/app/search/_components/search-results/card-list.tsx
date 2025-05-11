'use client';

import type { Card } from '@/generated/prisma';
import { CardListItem } from './card-list-item';

type Props = {
  cards: Card[];
};
export const CardList = ({ cards }: Props) => {
  return (
    <div className="divide-y divide-blue-300">
      {cards.map((card) => (
        <CardListItem key={card.numbering} card={card} />
      ))}
    </div>
  );
};
