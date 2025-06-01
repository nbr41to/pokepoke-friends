'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Card } from '@/generated/prisma';
import { CircleX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { addTagSelectedCards, removeTagSelectedCards } from '../actions';
import { useFilteredCards } from '../utils/use-filtered-cards';
import { CardList } from './card-list';
import { SearchForm } from './search-form';

type Props = {
  cards: Card[];
};
export const CardEditor = ({ cards }: Props) => {
  const filteredCards = useFilteredCards({ cards });
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [tagText, setTagText] = useState('');

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

  const commonTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    for (const card of selectedCards) {
      for (const tag of card.tags) {
        if (tagCounts[tag]) {
          tagCounts[tag]++;
        } else {
          tagCounts[tag] = 1;
        }
      }
    }
    return Object.entries(tagCounts)
      .filter(([_, count]) => count === selectedCards.length)
      .map(([tag]) => tag);
  }, [selectedCards]);

  return (
    <div className="relative space-y-2">
      <div>
        <SearchForm />
      </div>

      {selectedCards.length > 0 && (
        <div className="sticky top-2 z-10 space-y-2 rounded border-2 bg-white/90 p-3">
          <h2 className="font-semibold">Selected</h2>
          <CardList cards={selectedCards} onClick={handleOnRemove} />
          <div>
            <h3>Tagsを一括追加</h3>
            <div className="flex w-80 items-center gap-2">
              <Input
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                placeholder="タグを入力"
              />
              <Button
                onClick={() =>
                  addTagSelectedCards(
                    selectedCards.map((card) => card.id),
                    tagText,
                  )
                }
              >
                追加
              </Button>
            </div>

            <h3>Tagsを一括削除</h3>
            {commonTags.length > 0 && (
              <div>
                {commonTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="destructive"
                    onClick={() =>
                      removeTagSelectedCards(
                        selectedCards.map((card) => card.id),
                        tag,
                      )
                    }
                  >
                    {tag}
                    <CircleX />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <CardList
          cards={filteredCards}
          selectedCards={selectedCards}
          onClick={handleOnSelect}
        />
      </div>
    </div>
  );
};
