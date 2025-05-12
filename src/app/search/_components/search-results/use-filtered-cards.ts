import CARD_DATA from '@/constants/data/all_cards.json';
import type { Card, PokemonEvolveStage } from '@/generated/prisma';
import { useMemo } from 'react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const useFilteredCards = () => {
  const { query } = useSearchQuery();

  const filteredCards = useMemo(
    () =>
      CARD_DATA.filter((card) => {
        const {
          cardTypes,
          pokemonTypes,
          rarities,
          evolveStages,
          hitpoints,
          movePower,
          packName,
          moveEnergy,
          moveColorlessEnergy,
          retreatCost,
          keywords,
          hasAbility,
        } = query;
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

        // カードのキーワードをカナに変換
        const keywordsKatakana = keywords.replace(
          /[\u3041-\u3096]/g,
          (match) => {
            const katakana = String.fromCharCode(match.charCodeAt(0) + 96);
            return katakana;
          },
        );

        return (
          /**
           * pokemonTypes
           * cardTypesがあるか、cardTypesがpokemonの時のみ有効
           */
          (pokemonTypes.length !== 0 && isPokemonOnly
            ? pokemonTypes.includes(card.type as (typeof pokemonTypes)[0])
            : true) &&
          /**
           * cardTypes
           */
          (cardTypes.length !== 0
            ? cardTypes.includes(card.cardType as (typeof cardTypes)[0])
            : true) &&
          /**
           * rarities
           */
          (rarities.length !== 0
            ? rarities.includes(card.rarity as (typeof rarities)[0])
            : true) &&
          /**
           * evolveStages
           */
          (evolveStages.length !== 0 && isPokemonOnly
            ? evolveStages.includes(card.evolveStage as PokemonEvolveStage)
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
           * moveEnergy
           */
          (moveEnergy !== null && isPokemonOnly
            ? card.move1energy?.length === moveEnergy ||
              card.move2energy?.length === moveEnergy
            : true) &&
          /**
           * moveNoneColorlessEnergy
           */
          (moveColorlessEnergy !== null && isPokemonOnly
            ? card.move1energy?.split('').filter((energy) => energy === 'C')
                .length === moveColorlessEnergy ||
              card.move2energy?.split('').filter((energy) => energy === 'C')
                .length === moveColorlessEnergy
            : true) &&
          /**
           * retreatCost
           */
          (retreatCost !== null ? card.retreat === retreatCost : true) &&
          /**
           * hasAbility
           */
          (hasAbility !== null && isPokemonOnly
            ? hasAbility
              ? card.abilityName !== null && card.abilityDescription !== null
              : card.abilityName === null && card.abilityDescription === null
            : true) &&
          /**
           * packName
           */
          (packName.length !== 0
            ? packName.some((name) => card.packName.startsWith(name))
            : true) &&
          /**
           * keywords
           */
          (keywords !== ''
            ? card.name.includes(keywords) ||
              card.description?.includes(keywords) ||
              card.abilityName?.includes(keywords) ||
              card.abilityDescription?.includes(keywords) ||
              card.move1name?.includes(keywords) ||
              card.move1description?.includes(keywords) ||
              card.move2name?.includes(keywords) ||
              card.move2description?.includes(keywords) ||
              card.packName?.includes(keywords) ||
              // 変換したカタカナと比較
              card.name.includes(keywordsKatakana) ||
              card.description?.includes(keywordsKatakana) ||
              card.abilityName?.includes(keywordsKatakana) ||
              card.abilityDescription?.includes(keywordsKatakana) ||
              card.move1name?.includes(keywordsKatakana) ||
              card.move1description?.includes(keywordsKatakana) ||
              card.move2name?.includes(keywordsKatakana) ||
              card.move2description?.includes(keywordsKatakana)
            : true)
        );
      }),
    [query],
  );

  return filteredCards as Card[];
};
