import PokeBall from '@/components/icons/PokeBall';
import { Separator } from '@/components/ui/separator';
import type { Deck } from '@/constants/types/deck';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { CreateButton } from './_components/create-button';

export default async function Page() {
  const cookieStore = await cookies();
  const decks = JSON.parse(cookieStore.get('decks')?.value || '[]') as Deck[];

  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="text-xl font-bold">デッキつくるよ</h1>
      <Separator />
      <div className="flex flex-wrap gap-4">
        <CreateButton disabled={decks.length > 9} />
        {decks.map((deck) => (
          <Link
            key={deck.id}
            className="flex w-[172px] flex-none flex-col gap-1 rounded border p-2 transition-transform hover:scale-105"
            href={`/decks/${deck.id}`}
          >
            {deck.thumbnail1 ? (
              <Image
                src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${deck.thumbnail1.replace('#', '_')}.png`}
                alt={deck.name}
                width={96}
                height={128}
              />
            ) : (
              <div className="flex h-32 w-24 items-center justify-center bg-gray-200">
                <PokeBall className="size-10" />
              </div>
            )}
            {/* Uncomment the line below if you want to display the deck name */}
            <h2 className="text-sm font-bold">{deck.name}</h2>
            <p className="text-xs">{deck.memo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
