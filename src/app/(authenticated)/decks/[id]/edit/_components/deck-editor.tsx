'use client';

import { Separator } from '@/components/ui/separator';
import type { Deck } from '@/constants/types/deck';
import { upsertDeck } from '../action';
import { DeckCardsForm } from './deck-cards-form';
import { DeckMetaForm } from './deck-meta-form';

type Props = { deck: Deck };

export const DeckEditor = ({ deck }: Props) => {
  const handleOnCardSelect = async (cardId: string) => {
    if (deck.cardIds.length > 19) return;
    /* カードが2枚までしか追加されないように注意 */
    if (deck.cardIds.filter((id) => id === cardId).length > 1) return;
    await upsertDeck({
      ...deck,
      cardIds: [...deck.cardIds, cardId].sort(),
    });
  };

  const handleOnCardDeselect = async (cardId: string) => {
    /* 指定のカードが2枚ある場合は1枚だけ削除するように注意 */
    const findIndex = deck.cardIds.findIndex((id) => id === cardId);
    if (findIndex === -1) return;
    const newCardIds = [...deck.cardIds];
    newCardIds.splice(findIndex, 1);
    await upsertDeck({
      ...deck,
      cardIds: newCardIds,
    });
  };

  const handleOnClearDeck = async () => {
    await upsertDeck({
      ...deck,
      cardIds: [],
    });
  };

  return (
    <div className="space-y-3">
      <pre>{JSON.stringify(deck, null, 2)}</pre>
      <DeckMetaForm deck={deck} />
      <Separator />
      <DeckCardsForm
        selectedCardIds={deck.cardIds}
        onCardSelect={handleOnCardSelect}
        onCardDeselect={handleOnCardDeselect}
        onClearDeck={handleOnClearDeck}
      />
    </div>
  );
};
