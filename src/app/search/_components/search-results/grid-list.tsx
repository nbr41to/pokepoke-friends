'use client';

import type { Card } from '@/generated/prisma';
import Image from 'next/image';

type Props = {
  size: 'small' | 'large';
  cards: Card[];
};
export const GridList = ({ size, cards }: Props) => {
  return (
    <div className="flex flex-wrap gap-1">
      {cards.map((card) => (
        <Image
          key={card.numbering}
          src={card.image}
          alt={card.name}
          width={0}
          height={0}
          style={{
            width: size === 'large' ? '44%' : '24%',
            maxWidth: size === 'large' ? '320px' : '200px',
            height: 'auto',
          }}
          unoptimized
        />
      ))}
    </div>
  );
};
