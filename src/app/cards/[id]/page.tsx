import { CARD_DATA } from '@/constants/data/converted';
import Image from 'next/image';
import GW_DATA from '@/constants/data/scraped/gw/gw.json';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = CARD_DATA.find(
    (card) => card.cardNumber === id.replace('_', ' #'),
  );
  const gwData = GW_DATA.filter((data) => data.name === card?.name);

  return (
    <div className="p-4">
      {card ? (
        <div className="flex gap-x-2">
          <div className="flex-none">
            <Image
              src={card?.image ?? ''}
              alt="card"
              width={200}
              height={200}
            />
          </div>
          <pre className="max-h-70 overflow-scroll rounded border p-1 text-sm">
            {JSON.stringify(card, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">Card not found</h1>
        </div>
      )}
      <div className="mt-4">
        {gwData.map((data, index) => (
          <div key={index} className="flex gap-x-2">
            <div className="flex-none">
              <Image src={data.image_url} alt="card" width={200} height={200} />
            </div>
            <pre className="max-h-70 overflow-scroll rounded border p-1 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
