'use client';
import type { Acquisition } from '@/constants/types/acquisition';
import type { CardType } from '@/constants/types/card-types';
import type { PokemonType } from '@/constants/types/pokemon-types';
import type { CardRarity } from '@/constants/types/raritis';
import { xorDecrypt, xorEncrypt } from '@/utils/crypto';
import { useQueryState } from 'nuqs';

const PASSWORD = 'password';
const DEFAUT_QUERY = {
  cardTypes: [] as CardType[],
  pokemonTypes: [] as PokemonType[],
  hitpoints: [null, null] as [number | null, number | null],
  movePower: [null, null] as [number | null, number | null],
  attack: [null, null] as [number | null, number | null],
  retreteCost: null as number | null,
  rarities: [] as CardRarity[],
  acquisition: [] as Acquisition[],
  keywords: '',
};
// const DEFAUT_QUERY = {
//   cardTypes: [...CARD_TYPE_LIST],
//   pokemonTypes: [...POKEMON_TYPE_LIST],
//   hitpoints: [
//     Math.min(...POKEMON_HITPOINTS_LIST),
//     Math.max(...POKEMON_HITPOINTS_LIST),
//   ],
//   movePower: [
//     Math.min(...POKEMON_MOVE_POWER_LIST),
//     Math.max(...POKEMON_MOVE_POWER_LIST),
//   ],
//   attack: [0, 100],
//   retreteCost: [],
//   rarities: [...CARD_RARUTIES_LIST],
//   keywords: '',
// };

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
