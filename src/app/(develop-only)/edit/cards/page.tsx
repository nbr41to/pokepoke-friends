import { Separator } from '@/components/ui/separator';
import prisma from '@/libs/prisma/client';
import { CardList } from './components/card-list';
import { CardEditor } from './components/cards-editor';

export default async function Page() {
  const cards = await prisma.card.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <div className="p-4">
      <h2 className="font-hachiMaru mb-4 text-center text-xl">
        カード一括操作
      </h2>
      <div>
        <CardEditor cards={cards} />
      </div>
    </div>
  );
}
