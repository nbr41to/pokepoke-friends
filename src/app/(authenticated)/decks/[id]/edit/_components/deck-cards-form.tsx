import { ResetButton } from '@/components/search-form';
import { KeywordDebounceForm } from '@/components/search-form/keyword-debounce-form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { DeckCardsFilter } from './deck-cards-filter';

type Props = {
  selectedCardIds: string[];
  onCardSelect: (cardId: string) => void;
  onCardDeselect: (cardId: string) => void;
  onClearDeck: () => void;
};

export const DeckCardsForm = ({
  selectedCardIds,
  onCardSelect,
  onCardDeselect,
  onClearDeck,
}: Props) => {
  return (
    <div className="space-y-3 bg-white p-4 shadow">
      <div className="sticky top-0 z-10 space-y-3 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            className="font-bold"
            onClick={onClearDeck}
          >
            はじめから
          </Button>
          <p className="">{selectedCardIds.length} / 20</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded border p-2">
          {selectedCardIds.map((cardId, index) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={cardId + index}
              type="button"
              onClick={() => onCardDeselect(cardId)}
            >
              <Image
                src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${cardId.replace('#', '_')}.png`}
                alt={cardId}
                width={112}
                height={112}
              />
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <KeywordDebounceForm />
          <ResetButton />
        </div>
      </div>

      <DeckCardsFilter onCardSelect={onCardSelect} />
    </div>
  );
};
