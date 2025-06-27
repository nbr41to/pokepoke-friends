import PokeBall from '@/components/icons/PokeBall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Deck } from '@/constants/types/deck';
import { useActionState, useMemo } from 'react';
import { updateDeckMeta } from '../action';
import { ThumbnailSelect } from './thumbnail-select';

type Props = {
  deck: Deck;
};

export const DeckMetaForm = ({ deck }: Props) => {
  const thumbnail1 = deck.thumbnail1 || deck.cardIds?.[0];
  const [state, action] = useActionState(updateDeckMeta, null);

  const thumbnails = useMemo(() => {
    const thumbnails = [];
    const thumbnail1 = deck.thumbnail1 || deck.cardIds?.[0];
    const thumbnail2 = deck.thumbnail2;
    const thumbnail3 = deck.thumbnail3;
    if (thumbnail1) thumbnails.push(thumbnail1);
    if (thumbnail2) thumbnails.push(thumbnail2);
    if (thumbnail3) thumbnails.push(thumbnail3);
    return thumbnails;
  }, [deck]);

  return (
    <form
      className="mx-auto flex flex-wrap justify-center gap-4"
      action={action}
    >
      {thumbnail1 ? (
        <ThumbnailSelect
          defaultValues={thumbnails}
          currentCardIds={deck.cardIds}
        />
      ) : (
        <div className="flex h-32 w-24 items-center justify-center rounded border bg-gray-100">
          <PokeBall className="size-10" />
        </div>
      )}

      <div className="space-y-2">
        <input type="hidden" name="id" value={deck.id} />
        <Input defaultValue={deck.name} name="name" placeholder="デッキ名" />
        <Input defaultValue={deck.memo} name="memo" placeholder="メモ" />
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
};
