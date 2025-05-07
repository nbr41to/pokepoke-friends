import { CARD_DATA } from '@/constants/data/converted';
import type { Card } from '@/constants/types/card';
import { useMemo } from 'react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const useFilterdCards = () => {
  const { query } = useSearchQuery();

  const filteredCards = useMemo(
    () =>
      CARD_DATA.filter((card) => {
        const { cardTypes, pokemonTypes, rarities, hitpoints, movePower } =
          query;
        /* cardTypesのfilterを未使用であるか、cardTypesがpokemonで絞り込んでいる場合に表示をポケモンだけにする */
        const isPokemonOnly =
          cardTypes.length === 0 || cardTypes.includes('pokemon');
        const moreThanMinHp =
          hitpoints[0] !== null && card.hp && card.hp >= hitpoints[0];
        const lessThanMaxHp =
          hitpoints[1] !== null && card.hp && card.hp <= hitpoints[1];
        const moreThanMinMovePower =
          movePower[0] !== null &&
          ((card.move1power && card.move1power >= movePower[0]) ||
            (card.move2power && card.move2power >= movePower[0]));
        const lessThanMaxMovePower =
          movePower[1] !== null &&
          ((card.move1power && card.move1power <= movePower[1]) ||
            (card.move2power && card.move2power <= movePower[1]));

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
