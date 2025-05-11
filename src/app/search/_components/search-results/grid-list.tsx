'use client';

import type { Card } from '@/generated/prisma';
import { cn } from '@/utils/classnames';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  size: 'small' | 'large';
  cards: Card[];
};
export const GridList = ({ size, cards }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-center p-1',
        size === 'large' ? 'gap-2' : 'gap-1',
      )}
    >
      {cards.map((card) => (
        <Link
          key={card.numbering}
          href={`/cards/${card.id.replace('#', '_')}`}
          className={cn(
            'drop-shadow-sm transition-transform hover:scale-105 active:scale-95',
            size === 'large'
              ? 'w-[46%] max-w-[320px]'
              : 'w-[18%] max-w-[200px]',
          )}
        >
          <Image
            src={card.image}
            alt={card.name}
            width={0}
            height={0}
            style={{
              width: '100%',
              height: 'auto',
            }}
            unoptimized
            className=""
          />
        </Link>
      ))}
    </div>
  );
};
