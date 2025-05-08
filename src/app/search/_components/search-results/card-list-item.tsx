'use client';

import { EnergyIcons } from '@/components/enegy-icons';
import PokeBall from '@/components/icons/PokeBall';
import { CARD_TYPE } from '@/constants/types/card-types';
import { CARD_RARUTIES_LABEL } from '@/constants/types/rarities';
import { $Enums, type Card } from '@/generated/prisma';
import { HardHat, Sprout, SquareUserRound, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  card: Card;
};
export const CardListItem = ({ card }: Props) => {
  return (
    <Link
      className="flex items-center gap-x-1 py-1 transition-colors hover:bg-gray-100"
      href={`/cards/${card.numbering.replace('#', '_')}`}
    >
      <Image
        src={card.image}
        alt={card.name}
        width={60}
        height={80}
        style={{ width: '60px', height: '80px' }}
        unoptimized
      />
      <div className="mb-auto grow space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-x-2">
            {card.cardType === $Enums.CardType.pokemon && (
              <PokeBall className="size-4" />
            )}
            {card.cardType === $Enums.CardType.trainers_support && (
              <SquareUserRound className="size-4" />
            )}
            {card.cardType === $Enums.CardType.trainers_goods && (
              <Wrench className="size-5" />
            )}
            {card.cardType === $Enums.CardType.trainers_pokemon_tools && (
              <HardHat className="size-5" />
            )}

            <h2 className="font-bold">{card.name}</h2>

            <span>（{card.evolveStage}）</span>

            {card.retreat != null && (
              <>
                <span className="text-sm">にげる:</span>
                {card.retreat > 0 ? (
                  <EnergyIcons energies={'C'.repeat(card.retreat)} size={12} />
                ) : (
                  '　'
                )}
              </>
            )}
            {card.cardType === CARD_TYPE.POKEMON && (
              <>
                <span className="text-sm">弱点:</span>
                {card.weakness || '　'}
              </>
            )}
          </div>

          <div className="flex items-end gap-x-2">
            <span className="text-xs">{card.numbering}</span>
            <span>
              {
                CARD_RARUTIES_LABEL[
                  card.rarity as keyof typeof CARD_RARUTIES_LABEL
                ]
              }
            </span>
          </div>
        </div>

        {/* わざ1 */}
        {card.move1name && card.move1energy && (
          <div className="px-2 py-1">
            <p className="flex items-center gap-x-1 text-sm text-gray-600">
              <EnergyIcons energies={card.move1energy} />
              <span className="font-bold">
                {card.move1name} {card.move1power}
              </span>
            </p>
            <p className="text-xs text-gray-500">{card.move1description}</p>
          </div>
        )}

        {/* わざ2 */}
        {card.move2name && card.move2energy && (
          <div className="px-2 py-1">
            <p className="flex items-center gap-x-1 text-sm text-gray-600">
              <EnergyIcons energies={card.move2energy} />
              <span className="font-bold">
                {card.move2name} {card.move2power}
              </span>
            </p>
            <p className="text-xs text-gray-500">{card.move2description}</p>
          </div>
        )}

        {/* 特性 */}
        {card.abilityName && (
          <p className="px-2 py-1 text-sm">
            <span className="flex items-center font-bold text-red-800">
              <Sprout className="size-4" />
              {card.abilityName}
            </span>
            <span className="text-xs text-gray-500">
              {card.abilityDescription}
            </span>
          </p>
        )}

        {/* ポケモン以外のカードの効果 */}
        <p className="text-xs text-gray-500">{card.description}</p>
      </div>
    </Link>
  );
};
