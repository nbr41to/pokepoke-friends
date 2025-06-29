'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { upsertDeck } from '../[id]/edit/action';

type Props = {
  disabled: boolean;
};
export const CreateButton = ({ disabled }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateDeck = async () => {
    try {
      const id = nanoid(8);
      await upsertDeck({
        id,
        thumbnail1: '',
        thumbnail2: '',
        thumbnail3: '',
        name: '新しいデッキ',
        memo: '',
        cardIds: [],
      });

      router.push(`/decks/${id}/edit`);
    } catch (error) {
      console.error('デッキの作成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full py-8"
      disabled={disabled || loading}
      onClick={handleCreateDeck}
    >
      <Plus className="size-10" />
    </Button>
  );
};
