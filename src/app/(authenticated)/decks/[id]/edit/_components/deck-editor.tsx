'use client';

import { Separator } from '@/components/ui/separator';
import type { Deck } from '@/constants/types/deck';
import { startTransition, useCallback, useOptimistic } from 'react';
import { upsertDeck } from '../action';
import { DeckCardsForm } from './deck-cards-form';
import { DeckMetaForm } from './deck-meta-form';

type Props = { deck: Deck };

export const DeckEditor = ({ deck }: Props) => {
  const [selectedCardIds, addOptimistic] = useOptimistic(
    deck.cardIds,
    (_state, newCardIds: string[]) => newCardIds,
  );

  const handleOnCardSelect = useCallback(
    async (cardId: string) => {
      /* デッキは20枚までしか追加されないように */
      if (selectedCardIds.length > 19) return;
      /* カードが2枚までしか追加されないように */
      if (selectedCardIds.filter((id) => id === cardId).length > 1) return;

      startTransition(async () => {
        const newCardIds = [...selectedCardIds, cardId].sort();
        addOptimistic(newCardIds);
        await upsertDeck({
          ...deck,
          cardIds: newCardIds,
        });
      });
    },
    [deck, selectedCardIds, addOptimistic],
  );

  const handleOnCardDeselect = useCallback(
    async (cardId: string) => {
      /* 指定のカードが2枚ある場合は1枚だけ削除するように注意 */
      const findIndex = selectedCardIds.findIndex((id) => id === cardId);
      if (findIndex === -1) return;

      startTransition(async () => {
        const newCardIds = [...selectedCardIds];
        newCardIds.splice(findIndex, 1);
        addOptimistic(newCardIds);
        await upsertDeck({
          ...deck,
          cardIds: newCardIds,
        });
      });
    },
    [deck, selectedCardIds, addOptimistic],
  );

  const handleOnClearDeck = async () => {
    await upsertDeck({
      ...deck,
      cardIds: [],
    });
  };

  return (
    <div className="space-y-8">
      <DeckMetaForm deck={deck} />
      <Separator />
      <DeckCardsForm
        selectedCardIds={selectedCardIds}
        onCardSelect={handleOnCardSelect}
        onCardDeselect={handleOnCardDeselect}
        onClearDeck={handleOnClearDeck}
      />
    </div>
  );
};
