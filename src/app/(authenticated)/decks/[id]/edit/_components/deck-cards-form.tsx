import { KeywordDebounceForm } from '@/components/search-form/keyword-debounce-form';
import { ResetIconButton } from '@/components/search-form/reset-icon-button';
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
    <div className="space-y-3 bg-white shadow">
      <div className="font-hachiMaru sticky top-0 z-10 w-screen space-y-3 bg-white/80 px-2 py-3">
        <div className="flex items-center gap-x-3">
          <Button
            variant="destructive"
            className="font-bold"
            onClick={onClearDeck}
          >
            はじめから
          </Button>
          <p className="">{selectedCardIds.length} / 20 枚</p>
        </div>
        <div className="w-full overflow-x-scroll rounded border">
          <div className="grid h-[212px] w-fit grid-cols-10 items-start justify-start gap-1 overflow-x-scroll p-2">
            {selectedCardIds.map((cardId, index) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={cardId + index}
                type="button"
                className="min-w-[68px]"
                onClick={() => onCardDeselect(cardId)}
              >
                <Image
                  src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${cardId.replace('#', '_')}.png`}
                  alt={cardId}
                  width={68}
                  height={68}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-80 items-center justify-end gap-2">
          <KeywordDebounceForm />
          <ResetIconButton />
        </div>
      </div>

      <DeckCardsFilter
        selectedCardIds={selectedCardIds}
        onCardSelect={onCardSelect}
      />
    </div>
  );
};
