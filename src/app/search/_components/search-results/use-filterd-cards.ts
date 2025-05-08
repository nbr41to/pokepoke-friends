import CARD_DATA from '@/constants/data/all_cards.json';
import type { Card } from '@/generated/prisma';
import { useMemo } from 'react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const useFilterdCards = () => {
  const { query } = useSearchQuery();

  const filteredCards = useMemo(
    () =>
      CARD_DATA.filter((card) => {
        const { cardTypes, pokemonTypes, rarities, hitpoints, movePower } =
          query;
        const { move1power, move2power } = card;
        const move1powerNum = move1power
          ? move1power?.endsWith('×') || move1power?.endsWith('+')
            ? Number.parseInt(move1power.slice(0, -1))
            : Number.parseInt(move1power)
          : null;
        const move2powerNum = move2power
          ? move2power?.endsWith('×') || move2power?.endsWith('+')
            ? Number.parseInt(move2power.slice(0, -1))
            : Number.parseInt(move2power)
          : null;
        /* cardTypesのfilterを未使用であるか、cardTypesがpokemonで絞り込んでいる場合に表示をポケモンだけにする */
        const isPokemonOnly =
          cardTypes.length === 0 || cardTypes.includes('pokemon');
        const moreThanMinHp =
          hitpoints[0] !== null && card.hp && card.hp >= hitpoints[0];
        const lessThanMaxHp =
          hitpoints[1] !== null && card.hp && card.hp <= hitpoints[1];
        const moreThanMinMovePower =
          movePower[0] !== null &&
          ((move1powerNum && move1powerNum >= movePower[0]) ||
            (move2powerNum && move2powerNum >= movePower[0]));
        const lessThanMaxMovePower =
          movePower[1] !== null &&
          ((move1powerNum && move1powerNum <= movePower[1]) ||
            (move2powerNum && move2powerNum <= movePower[1]));

        return (
          /**
           * cardTypes
           */
          (cardTypes.length !== 0
            ? cardTypes.includes(card.cardType as (typeof cardTypes)[0])
            : true) &&
          /**
           * pokemonTypes
           * cardTypesがあるか、cardTypesがpokemonの時のみ有効
           */
          (pokemonTypes.length !== 0 && isPokemonOnly
            ? pokemonTypes.includes(card.type as (typeof pokemonTypes)[0])
            : true) &&
          /**
           * hitpoints
           */
          (hitpoints[0] !== null && isPokemonOnly ? moreThanMinHp : true) &&
          (hitpoints[1] !== null && isPokemonOnly ? lessThanMaxHp : true) &&
          /**
           * movePower
           */
          (movePower[0] !== null && isPokemonOnly
            ? moreThanMinMovePower
            : true) &&
          (movePower[1] !== null && isPokemonOnly
            ? lessThanMaxMovePower
            : true) &&
          /**
           * rarities
           */
          (rarities.length !== 0
            ? rarities.includes(card.rarity as (typeof rarities)[0])
            : true)
        );
      }),
    [query],
  );

  return filteredCards as Card[];
};
