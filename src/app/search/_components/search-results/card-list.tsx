'use client';

import type { Card } from '@/constants/types/card';
import { CardListItem } from './card-list-item';

type Props = {
  cards: Card[];
};
export const CardList = ({ cards }: Props) => {
  return (
    <div className="divide-y">
      {cards.map((card) => (
        <CardListItem key={card.id + card.cardNumber} card={card} />
      ))}
    </div>
  );
};
