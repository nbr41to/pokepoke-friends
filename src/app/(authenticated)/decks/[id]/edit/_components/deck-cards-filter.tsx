import ALL_CARD from '@/constants/data/all_cards.json';
import type { Card } from '@/generated/prisma';
import { useFilteredCards } from '@/utils/use-filtered-cards';
import Image from 'next/image';

type Props = {
  selectedCardIds: string[];
  onCardSelect: (cardId: string) => void;
};

export const DeckCardsFilter = ({ selectedCardIds, onCardSelect }: Props) => {
  const filteredCards = useFilteredCards({ cards: ALL_CARD as Card[] });

  return (
    <div className="flex flex-wrap gap-0.5 px-2">
      {filteredCards.map((card) => {
        const selectedCount = selectedCardIds.filter(
          (id) => id === card.id,
        ).length;

        return (
          <button
            key={card.id}
            type="button"
            className="relative"
            onClick={() => onCardSelect(card.id)}
          >
            <Image src={card.image} alt={card.name} width={98} height={98} />
            {selectedCount > 0 && (
              <div className="absolute top-0 right-0 grid h-full w-full place-content-center bg-black/70 opacity-40">
                <span className="grid size-12 place-content-center rounded-full bg-black font-mono text-3xl font-bold text-white">
                  x{selectedCount}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
