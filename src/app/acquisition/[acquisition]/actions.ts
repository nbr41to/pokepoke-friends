'use server';

import prisma from '@/libs/prisma/client';

export const insertCard = async (params: any) => {
  await prisma.card.upsert({
    where: {
      id: params.id,
    },
    update: params,
    create: params,
  });
};
export const insertCards = async (params: any) => {
  console.info('Start inserting cards');
  const response = await prisma.card.createMany({
    data: params,
    skipDuplicates: true, // 重複をスキップ
  });
  console.info('Inserted cards:', response.count);
};
