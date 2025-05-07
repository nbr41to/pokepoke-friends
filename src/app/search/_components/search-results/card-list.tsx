'use client';

import { EnergyIcons } from '@/components/enegy-icons';
import PokeBall from '@/components/icons/PokeBall';
import type { Card } from '@/constants/types/card';
import { CARD_TYPE } from '@/constants/types/card-types';
import { CARD_RARUTIES_LABEL } from '@/constants/types/raritis';
import { HardHat, Sprout, SquareUserRound, Wrench } from 'lucide-react';
import Image from 'next/image';

type Props = {
  cards: Card[];
};
export const CardList = ({ cards }: Props) => {
  return (
    <div className="divide-y">
      {cards.map((card) => (
        <div
          key={card.id + card.cardNumber}
          className="flex items-center gap-x-1 py-1"
        >
          <Image
            src={card.image}
            alt={card.name}
            width={60}
            height={80}
            style={{ width: '60px', height: '80px' }}
            unoptimized
          />
          <div className="grow space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-x-2">
                {card.cardType === CARD_TYPE.POKEMON && (
                  <PokeBall className="size-4" />
                )}
                {card.cardType === CARD_TYPE.TRAINERS_SUPPORT && (
                  <SquareUserRound className="size-4" />
                )}
                {card.cardType === CARD_TYPE.TRAINERS_GOODS && (
                  <Wrench className="size-5" />
                )}
                {card.cardType === CARD_TYPE.TRAINERS_POKEMON_TOOLS && (
                  <HardHat className="size-5" />
                )}

                <h2 className="font-bold">{card.name}</h2>

                <span>（{card.evolveStage}）</span>

                {card.retreat && (
                  <>
                    <span className="text-sm">にげる:</span>
                    <EnergyIcons
                      energies={'C'.repeat(card.retreat)}
                      size={12}
                    />
                  </>
                )}
                {card.retreat && (
                  <>
                    <span className="text-sm">弱点:</span>
                    {card.weakness}
                  </>
                )}
              </div>

              <div>
                {
                  CARD_RARUTIES_LABEL[
                    card.rarity as keyof typeof CARD_RARUTIES_LABEL
                  ]
                }
              </div>
            </div>

            {/* わざ1 */}
            {card.move1name && (
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
        </div>
      ))}
    </div>
  );
};
