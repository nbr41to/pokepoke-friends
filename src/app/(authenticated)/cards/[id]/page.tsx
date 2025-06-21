import { EnergyIcons } from '@/components/enegy-icons';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CARD_TYPE_LABEL } from '@/constants/types/card-types';
import { POKEMON_EVOLVE_STAGE_LABEL } from '@/constants/types/pokemon-status';
import {
  POKEMON_TYPE_LABEL,
  POKEMON_TYPE_SYMBOL,
} from '@/constants/types/pokemon-types';
import { CARD_RARITIES_LABEL } from '@/constants/types/rarities';
import { CardType } from '@/generated/prisma';
import prisma from '@/libs/prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transformedId = id.replace(/_/g, '#');
  const card = await prisma.card.findUnique({
    where: {
      id: transformedId,
    },
  });

  if (!card) notFound();

  const tableData = [
    { label: 'No.', value: card.id },
    { label: '名前', value: card.name },
    { label: 'カードタイプ', value: CARD_TYPE_LABEL[card.cardType] },
    { label: 'レアリティ', value: CARD_RARITIES_LABEL[card.rarity] },
    { label: 'パック名', value: card.packName },
    {
      label: 'タイプ',
      value: card.type && (
        <div className="flex items-center gap-1">
          <EnergyIcons size={14} energies={POKEMON_TYPE_SYMBOL[card.type]} />
          {POKEMON_TYPE_LABEL[card.type]}
        </div>
      ),
    },
    { label: 'HP', value: card.hp },
    {
      label: '進化段階',
      value: card.evolveStage && POKEMON_EVOLVE_STAGE_LABEL[card.evolveStage],
    },
    {
      label: '弱点',
      value:
        card.cardType === CardType.pokemon ? (
          card.weakness ? (
            <div className="flex items-center gap-1">
              <EnergyIcons
                size={14}
                energies={POKEMON_TYPE_SYMBOL[card.weakness]}
              />
              {POKEMON_TYPE_LABEL[card.weakness]}
            </div>
          ) : (
            '　'
          )
        ) : null,
    },
    {
      label: '逃げるコスト',
      value: card.retreat && (
        <EnergyIcons energies={'C'.repeat(card.retreat)} />
      ),
    },
    {
      label: 'わざ1',
      value: card.move1name && card.move1energy && (
        <div>
          <div className="flex items-center gap-2">
            <div>
              <EnergyIcons energies={card.move1energy} />
            </div>
            <div>{card.move1name}</div>
            <div>{card.move1power}</div>
          </div>
          <div>{card.move1description}</div>
        </div>
      ),
    },
    {
      label: 'わざ2',
      value: card.move2name && card.move2energy && (
        <div>
          <div className="flex items-center gap-2">
            <div>
              <EnergyIcons energies={card.move2energy} />
            </div>
            <div>{card.move2name}</div>
            <div>{card.move2power}</div>
          </div>
          <div>{card.move2description}</div>
        </div>
      ),
    },
    {
      label: '特性',
      value: card.abilityName && card.abilityDescription && (
        <div>
          <div>{card.abilityName}</div>
          <div>{card.abilityDescription}</div>
        </div>
      ),
    },
    {
      label: card.cardType === CardType.pokemon ? '説明' : '効果',
      value: card.description,
    },
    {
      label: '最終データ更新',
      value: new Date(card.updatedAt).toLocaleString('ja-JP'),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full max-w-[400px] flex-none space-y-2">
          <h2 className="flex justify-between border-b">
            <span className="text-xl font-bold">{card.name}</span>
            <span>{card.id}</span>
          </h2>
          <Image
            src={card.image}
            alt="card"
            width={400}
            height={400}
            style={{ width: '400px', height: 'auto' }}
            unoptimized
          />
        </div>

        <Table className="max-w-3xl">
          <TableBody>
            {tableData
              .filter((row) => row.value)
              .map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="whitespace-pre-wrap">
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
