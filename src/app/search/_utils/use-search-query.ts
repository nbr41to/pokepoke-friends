'use client';

import { CARD_TYPE_LIST } from '@/constants/data/card-types';
import {
  POKEMON_HITPOINTS_LIST,
  POKEMON_MOVE_POWER_LIST,
} from '@/constants/data/pokemon-status';
import { POKEMON_TYPE_LIST } from '@/constants/data/pokemon-types';
import { CARD_RARUTIES_LIST } from '@/constants/data/raritis';
import { xorDecrypt, xorEncrypt } from '@/utils/crypto';
import { useQueryState } from 'nuqs';

const PASSWORD = 'password';
const DEFAUT_QUERY = {
  cardTypes: [...CARD_TYPE_LIST],
  pokemonTypes: [...POKEMON_TYPE_LIST],
  hitpoints: [
    Math.min(...POKEMON_HITPOINTS_LIST),
    Math.max(...POKEMON_HITPOINTS_LIST),
  ],
  movePower: [
    Math.min(...POKEMON_MOVE_POWER_LIST),
    Math.max(...POKEMON_MOVE_POWER_LIST),
  ],
  attack: [0, 100],
  retreteCost: [],
  rarities: [...CARD_RARUTIES_LIST],
  keywords: '',
};

export const useSearchQuery = () => {
  const [query, setQuery] = useQueryState('query', {
    defaultValue: xorEncrypt(DEFAUT_QUERY, PASSWORD),
  });

  return {
    query: xorDecrypt<typeof DEFAUT_QUERY>(query, PASSWORD),
    setQuery: (newQuery: typeof DEFAUT_QUERY) =>
      setQuery(xorEncrypt(newQuery, PASSWORD)),
  };
};
