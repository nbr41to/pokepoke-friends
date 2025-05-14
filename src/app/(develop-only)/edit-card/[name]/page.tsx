import { Separator } from '@/components/ui/separator';
import prisma from '@/libs/prisma/client';
import { Fragment } from 'react';
import { EditForm } from './edit-form';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const cards = await prisma.card.findMany({
    where: { name: decodedName },
    orderBy: { id: 'asc' },
  });

  return (
    <div className="p-4">
      <h2 className="font-hachiMaru mb-4 text-center text-xl">
        「{decodedName}」のデータベース
      </h2>

      <div>
        {cards.map((card) => (
          <Fragment key={card.id}>
            <EditForm card={card} />
            <Separator className="my-20" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
