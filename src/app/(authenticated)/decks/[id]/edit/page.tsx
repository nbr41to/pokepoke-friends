import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';

import type { Deck } from '@/constants/types/deck';
import { DeckEditor } from './_components/deck-editor';

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
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="font-hachiMaru text-xl font-bold">デッキつくるよ</h1>
      <Separator />
      <DeckEditor deck={deck} />
    </div>
  );
}
