'use client';

import {
  A1JSON,
  A1aJSON,
  A2JSON,
  A2aJSON,
  A2bJSON,
  A3JSON,
  P_AJSON,
} from '@/constants/data/converted';
import { POKEMON_MOVE_ENERGY } from '@/constants/types/pokemon-status';
import { POKEMON_TYPE } from '@/constants/types/pokemon-types';
import { CARD_RARUTIES_LABEL } from '@/constants/types/raritis';
import Image from 'next/image';
import { useMemo } from 'react';
import { useSearchQuery } from '../_utils/use-search-query';

const ALL_DATA = [
  ...A1JSON,
  ...A1aJSON,
  ...A2JSON,
  ...A2aJSON,
  ...A2bJSON,
  ...A3JSON,
  ...P_AJSON,
];

export const CardList = () => {
  const { query } = useSearchQuery();

  const filteredCards = useMemo(
    () =>
      ALL_DATA.filter((card) => {
        const { cardTypes, pokemonTypes, rarities } = query;

        return (
          cardTypes.includes(card.cardType as (typeof cardTypes)[0]) &&
          (card.cardType === 'pokemon'
            ? pokemonTypes.includes(card.type as (typeof pokemonTypes)[0])
            : true) &&
          rarities.includes(card.rarity as (typeof rarities)[0])
        );
      }),
    [query],
  );

  return (
    <div className="divide-y">
      <div>{filteredCards.length} cards found</div>
      {filteredCards.map((card) => (
        <div
          key={card.id + card.cardNumber}
          className="flex items-center gap-x-2 p-1"
        >
          <Image
            src={card.image}
            alt={card.name}
            width={40}
            height={60}
            style={{ width: '40px', height: 'auto' }}
            unoptimized
          />
          <div>
            <h2 className="text-lg font-bold">
              {card.name} {card.cardType}{' '}
              {
                CARD_RARUTIES_LABEL[
                  card.rarity as keyof typeof CARD_RARUTIES_LABEL
                ]
              }
            </h2>
            {card.move1name && (
              <p className="space-x-2 text-sm text-gray-500">
                <span className="space-x-0.5">
                  {card.move1energy.split('').map((energy, index) => (
                    <EnergyIcon
                      key={`${card.id}-type-icon${index}`}
                      energy={energy}
                    />
                  ))}
                </span>
                <span className="font-bold">
                  {card.move1name} {card.move1power}
                </span>
                <br />
                <span className="text-xs">{card.move1description}</span>
              </p>
            )}
            {card.move2name && (
              <p className="space-x-2 text-sm text-gray-500">
                <span className="space-x-0.5">
                  {card.move2energy.split('').map((energy, index) => (
                    <EnergyIcon
                      key={`${card.id}-type-icon${index}`}
                      energy={energy}
                    />
                  ))}
                </span>
                <span className="font-bold">
                  {card.move2name} {card.move2power}
                </span>
                <br />
                <span className="text-xs">{card.move2description}</span>
              </p>
            )}
            {card.abilityName && (
              <p className="text-sm text-gray-500">
                <span className="font-bold">{card.abilityName}</span>
                <br />
                {card.abilityDescription}
              </p>
            )}
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const EnergyIcon = ({ energy }: { energy: string }) => {
  const energyType =
    POKEMON_MOVE_ENERGY[energy as keyof typeof POKEMON_MOVE_ENERGY];
  const imageIndex = Object.values(POKEMON_TYPE).indexOf(energyType);

  return (
    <Image
      src={`/type${imageIndex + 1}.png`}
      alt={energy}
      width={12}
      height={12}
      style={{ width: '12px', height: '12px' }}
      className="inline-block"
      unoptimized
    />
  );
};
