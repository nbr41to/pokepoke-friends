import { CARD_DATA } from '@/constants/data/converted';
import JA_DATA from '@/constants/data/scraped/ja/ja.json';
import { ACQUISITION_LABEL } from '@/constants/types/acquisition';
import prisma from '@/libs/prisma/client';
import { DataManager } from './_components/data-manager';

export default async function Page({
  params,
}: {
  params: Promise<{ acquisition: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { acquisition } = await params;
  const cardPackName =
    ACQUISITION_LABEL[acquisition as keyof typeof ACQUISITION_LABEL];
  const thisAcquisitionCards = CARD_DATA.filter(
    (card) => card.cardNumber.split(' ')[0] === acquisition,
  );
  const jaData = JA_DATA.filter((jaData) =>
    jaData.acquisition_pack.startsWith(cardPackName.replace(/ /g, '')),
  );
  const dbData = await prisma.card.findMany({
    where: {
      id: {
        startsWith: acquisition,
      },
    },
  });

  return (
    <div className="p-4">
      <h2 className="font-hachiMaru mb-4 text-center text-xl">
        {cardPackName} カード一覧
      </h2>
      <DataManager
        cards={thisAcquisitionCards}
        jaCards={jaData}
        dbCards={dbData}
      />
    </div>
  );
}
