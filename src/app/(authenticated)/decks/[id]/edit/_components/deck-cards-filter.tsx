import ALL_CARD from '@/constants/data/all_cards.json';
import type { Card } from '@/generated/prisma';
import { useFilteredCards } from '@/utils/use-filtered-cards';
import Image from 'next/image';

type Props = {
  onCardSelect: (cardId: string) => void;
};

export const DeckCardsFilter = ({ onCardSelect }: Props) => {
  const filteredCards = useFilteredCards({ cards: ALL_CARD as Card[] });

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardSelect(card.id)}
          >
            <Image src={card.image} alt={card.name} width={120} height={120} />
          </button>
        ))}
      </div>
    </div>
  );
};
