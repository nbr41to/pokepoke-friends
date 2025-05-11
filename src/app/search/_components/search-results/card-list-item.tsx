'use client';

import { EnergyIcons } from '@/components/enegy-icons';
import PokeBall from '@/components/icons/PokeBall';
import { Badge } from '@/components/ui/badge';
import { CARD_TYPE } from '@/constants/types/card-types';
import {
  POKEMON_EVOLVE_STAGE_LABEL,
  POKEMON_MOVE_ENERGY,
} from '@/constants/types/pokemon-status';
import { CARD_RARITIES_LABEL } from '@/constants/types/rarities';
import { $Enums, type Card } from '@/generated/prisma';
import { HardHat, SquareUserRound, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  card: Card;
};
export const CardListItem = ({ card }: Props) => {
  const weaknessSymbol =
    Object.entries(POKEMON_MOVE_ENERGY).find(
      ([, value]) => value === card.weakness,
    )?.[0] ?? null;

  return (
    <Link
      className="flex gap-x-2 p-2 transition-colors hover:bg-blue-200 active:opacity-50"
      href={`/cards/${card.id.replace('#', '_')}`}
    >
      <Image
        src={card.image}
        alt={card.name}
        width={60}
        height={80}
        style={{ width: '60px', height: '80px' }}
        unoptimized
      />

      <div className="grow space-y-1 pr-2">
        <div className="flex items-center justify-between text-sm">
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

            {card.evolveStage && (
              <Badge variant="secondary" className="font-bold">
                {POKEMON_EVOLVE_STAGE_LABEL[card.evolveStage]}
              </Badge>
            )}
          </div>

          <div className="flex gap-x-2">
            <span>
              {
                CARD_RARITIES_LABEL[
                  card.rarity as keyof typeof CARD_RARITIES_LABEL
                ]
              }
            </span>
            <span>{card.id.replace('#', ' #')}</span>
          </div>
        </div>

        {/* わざ1 */}
        {card.move1name && card.move1energy && (
          <div className="space-y-1 py-1 text-sm">
            <p className="flex items-center gap-x-2">
              <EnergyIcons energies={card.move1energy} />
              <span className="font-bold">{card.move1name}</span>
              <span className="font-bold">{card.move1power}</span>
            </p>
            <p className="text-xs text-gray-600">{card.move1description}</p>
          </div>
        )}

        {/* わざ2 */}
        {card.move2name && card.move2energy && (
          <div className="space-y-1 py-1 text-sm">
            <p className="flex items-center gap-x-2">
              <EnergyIcons energies={card.move2energy} />
              <span className="font-bold">{card.move2name}</span>
              <span className="font-bold">{card.move2power}</span>
            </p>
            <p className="text-xs text-gray-600">{card.move2description}</p>
          </div>
        )}

        {/* 特性 */}
        {card.abilityName && (
          <div className="space-y-1 py-1 text-sm">
            <Badge variant="destructive" className="font-bold">
              {card.abilityName}
            </Badge>
            <p className="text-xs text-gray-600">{card.abilityDescription}</p>
          </div>
        )}

        {/* ポケモン以外のカードの効果 */}
        {card.cardType !== $Enums.CardType.pokemon && card.description && (
          <p className="py-1 text-xs text-gray-800">{card.description}</p>
        )}
        {card.cardType === CARD_TYPE.POKEMON && (
          <div className="flex items-center justify-between gap-x-4 sm:justify-start">
            <div className="flex items-center gap-x-1">
              <span className="text-xs">弱点</span>
              {weaknessSymbol ? (
                <EnergyIcons energies={weaknessSymbol} size={14} />
              ) : (
                '　'
              )}
            </div>

            <div className="flex items-center gap-x-1">
              <span className="text-xs">にげる</span>
              {card.retreat && card.retreat > 0 ? (
                <EnergyIcons energies={'C'.repeat(card.retreat)} size={14} />
              ) : (
                '　'
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
