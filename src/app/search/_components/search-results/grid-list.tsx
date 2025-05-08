'use client';

import type { Card } from '@/generated/prisma';
import Image from 'next/image';

type Props = {
  cards: Card[];
};
export const GridList = ({ cards }: Props) => {
  return (
    <div className="flex flex-wrap gap-1">
      {cards.map((card) => (
        <div key={card.numbering} className="relative">
          <Image
            src={card.image}
            alt={card.name}
            width={130}
            height={180}
            style={{ width: 'auto', height: '180px' }}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};
