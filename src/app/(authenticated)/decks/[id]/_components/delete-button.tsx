'use client';

import { Button } from '@/components/ui/button';
import { deleteDeck } from '../actions';

type Props = {
  deckId: string;
};

export const DeleteButton = ({ deckId }: Props) => {
  return (
    <Button variant="destructive" onClick={() => deleteDeck(deckId)}>
      デッキを削除
    </Button>
  );
};
