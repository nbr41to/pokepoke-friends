import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import type { Deck } from '@/constants/types/deck';
import Link from 'next/link';
import { CardWithDetailModal } from './_components/card-with-detail-modal';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const decks = JSON.parse(cookieStore.get('decks')?.value || '[]') as Deck[];
  const deck = decks.find((d) => d.id === id);
  if (!deck) {
    return <div className="text-red-500">Deck not found</div>;
  }

  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="text-xl font-bold">「{deck.name}」</h1>
      <p>メモ: {deck.memo}</p>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button>
            <Link href={`/decks/${deck.id}/edit`}>編集する</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {deck.cardIds.map((cardId, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <CardWithDetailModal key={cardId + index} cardId={cardId} />
          ))}
        </div>
      </div>
    </div>
  );
}
