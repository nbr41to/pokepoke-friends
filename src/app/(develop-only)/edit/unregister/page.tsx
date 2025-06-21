import { CARD_DATA } from '@/constants/data/converted';
import prisma from '@/libs/prisma/client';
import Image from 'next/image';

export default async function Page() {
  const cards = await prisma.card.findMany({
    orderBy: { id: 'asc' },
  });
  const unregisteredCards = CARD_DATA.filter(
    (card) =>
      !cards.some((c) => c.numbering === card.cardNumber.replace(' ', '')),
  );

  return (
    <div className="p-4">
      <h2 className="font-hachiMaru mb-4 text-center text-xl">未登録カード</h2>
      <p>スクレイピングしたけどDBに存在しないカード一覧</p>
      <div>
        {unregisteredCards.length > 0 ? (
          <ul className="space-y-2">
            {unregisteredCards.map((card) => (
              <li key={card.cardNumber} className="flex gap-x-3">
                <Image
                  src={card.image}
                  width={80}
                  height={160}
                  alt={card.name}
                />
                <div>
                  {card.cardNumber} - {card.name}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>未登録のカードはありません。</p>
        )}
      </div>
    </div>
  );
}
