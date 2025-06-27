'use client';
import type { CardRarity } from '@/constants/types/rarities';
import type {
  CardType,
  PokemonEvolveStage,
  PokemonType,
} from '@/generated/prisma';
import { xorDecrypt, xorEncrypt } from '@/utils/crypto';
import { useQueryState } from 'nuqs';

const PASSWORD = 'password';

type Condition = {
  cardTypes: CardType[];
  pokemonTypes: PokemonType[];
  evolveStages: PokemonEvolveStage[];
  hitpoints: [number | null, number | null];
  movePower: [number | null, number | null];
  moveEnergy: number | null;
  moveColorlessEnergy: number | null;
  hasAbility: boolean | null;
  retreatCost: number | null;
  rarities: CardRarity[];
  packName: string[];
  keywords: string;
};
const DEFAULT_CONDITION: Condition = {
  cardTypes: [],
  pokemonTypes: [],
  evolveStages: [],
  hitpoints: [null, null],
  movePower: [null, null],
  moveEnergy: null,
  moveColorlessEnergy: null,
  hasAbility: null,
  retreatCost: null,
  rarities: [],
  packName: [],
  keywords: '',
} as const;

const conditionToQuery = (condition: Condition) => {
  for (const [key, value] of Object.entries(condition)) {
    if (value === null || value === '') {
      delete condition[key as keyof Condition];
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        delete condition[key as keyof Condition];
      }
      if (value[0] === null && value[1] === null) {
        delete condition[key as keyof Condition];
      }
    }
  }

  return xorEncrypt({ ...DEFAULT_CONDITION, ...condition }, PASSWORD);
};

const queryToCondition = (query: string) => {
  const decryptedCondition = xorDecrypt<Condition>(query, PASSWORD);

  return {
    ...DEFAULT_CONDITION,
    ...decryptedCondition,
  } as Condition;
};

export const useSearchQuery = () => {
  const [query, setQuery] = useQueryState('query', {
    defaultValue: xorEncrypt(DEFAULT_CONDITION, PASSWORD),
  });

  return {
    query: queryToCondition(query),
    setQuery: (newQuery: Condition) => setQuery(conditionToQuery(newQuery)),
    resetQuery: () => setQuery(xorEncrypt(DEFAULT_CONDITION, PASSWORD)),
  };
};
