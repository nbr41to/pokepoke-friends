'use client';
import type { PokemonType } from '@/constants/types/pokemon-types';
import type { CardRarity } from '@/constants/types/rarities';
import type { CardType } from '@/generated/prisma';
import { xorDecrypt, xorEncrypt } from '@/utils/crypto';
import { useQueryState } from 'nuqs';

const PASSWORD = 'password';
const DEFAUT_QUERY = {
  cardTypes: [] as CardType[],
  pokemonTypes: [] as PokemonType[],
  hitpoints: [null, null] as [number | null, number | null],
  movePower: [null, null] as [number | null, number | null],
  moveEnergy: null as number | null,
  moveNoneColorlessEnergy: null as number | null,
  moveColorlessEnergy: null as number | null,
  hasAbility: null as boolean | null,
  attack: [null, null] as [number | null, number | null],
  retreatCost: null as number | null,
  rarities: [] as CardRarity[],
  packName: [] as string[],
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
    resetQuery: () => setQuery(xorEncrypt(DEFAUT_QUERY, PASSWORD)),
  };
};
