'use client';

import type { Card } from '@/generated/prisma';
import { useState } from 'react';
import { useSearchQuery } from '../utils/use-search-query';
import { CardList } from './card-list';
import { SearchForm } from './search-form';

type Props = {
  cards: Card[];
};
export const CardEditor = ({ cards }: Props) => {
  const { query } = useSearchQuery();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const handleOnSelect = (card: Card) => {
    setSelectedCards((prev) => {
      const exists = prev.find((c) => c.id === card.id);
      if (exists) {
        return prev.filter((c) => c.id !== card.id);
      }
      return [...prev, card];
    });
  };

  const handleOnRemove = (card: Card) => {
    setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  return (
    <div className="relative space-y-2">
      <div>
        <SearchForm />
      </div>

      {selectedCards.length > 0 && (
        <div className="sticky top-2 z-10 space-y-2 rounded border-2 bg-white/90 p-3">
          <h2 className="font-semibold">Selected</h2>
          <CardList cards={selectedCards} onClick={handleOnRemove} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <CardList
          cards={cards}
          selectedCards={selectedCards}
          onClick={handleOnSelect}
        />
      </div>
    </div>
  );
};
