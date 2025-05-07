import { CARD_DATA } from '@/constants/data/converted';
import Image from 'next/image';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = CARD_DATA.find(
    (card) => card.cardNumber === id.replace('_', ' #'),
  );

  return (
    <div className="p-4">
      {card ? (
        <div className="space-y-4">
          <Image
            src={card?.image ?? ''}
            alt="card"
            width={360}
            height={360}
            className="mx-auto"
          />
          <pre>{JSON.stringify(card, null, 2)}</pre>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">Card not found</h1>
        </div>
      )}
    </div>
  );
}
