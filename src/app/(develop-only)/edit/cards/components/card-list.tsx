import type { Card } from '@/generated/prisma';
import { cn } from '@/utils/classnames';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

type Props = {
  cards: Card[];
  selectedCards?: Card[];
  onClick: (card: Card) => void;
};
export const CardList = ({ cards, selectedCards = [], onClick }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {cards.map((card) => {
        const isSelected = selectedCards.some((c) => c.id === card.id);

        return (
          <button
            key={card.id}
            type="button"
            className={cn(
              'relative cursor-pointer',
              isSelected && 'rounded ring-3 ring-blue-500',
            )}
            onClick={() => onClick(card)}
          >
            <Image
              src={card.image}
              alt={card.name}
              width={100}
              height={140}
              className={cn('cursor-pointer', isSelected && 'grayscale')}
            />
            <CheckCircle2
              className={cn(
                'absolute -top-2 -left-2 size-6 rounded-full bg-blue-500 text-white',
                isSelected ? 'block' : 'hidden',
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
