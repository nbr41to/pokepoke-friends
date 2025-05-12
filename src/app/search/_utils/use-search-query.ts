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
  cardTypes?: CardType[];
  pokemonTypes?: PokemonType[];
  evolveStages?: PokemonEvolveStage[];
  hitpoints?: [number | null, number | null];
  movePower?: [number | null, number | null];
  moveEnergy?: number | null;
  moveColorlessEnergy?: number | null;
  hasAbility?: boolean | null;
  attack?: [number | null, number | null];
  retreatCost?: number | null;
  rarities?: CardRarity[];
  packName?: string[];
  keywords?: string;
};
const DEFAULT_QUERY: Condition = {
  cardTypes: [],
  pokemonTypes: [],
  evolveStages: [],
  hitpoints: [null, null],
  movePower: [null, null],
  moveEnergy: null,
  moveColorlessEnergy: null,
  hasAbility: null,
  attack: [null, null],
  retreatCost: null,
  rarities: [],
  packName: [],
  keywords: '',
} as const;

const conditionToQuery = (condition: Condition) => {
  for (const [key, value] of Object.entries(condition)) {
    if (value === null) {
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

  return xorEncrypt(condition, PASSWORD);
};

const queryToCondition = (query: string) => {
  const decryptedCondition = xorDecrypt<Condition>(query, PASSWORD);

  return {
    ...DEFAULT_QUERY,
    ...decryptedCondition,
  };
};

export const useSearchQuery = () => {
  const [query, setQuery] = useQueryState('query', {
    defaultValue: conditionToQuery({}),
  });

  return {
    query: queryToCondition(query),
    setQuery: (newQuery: Condition) => setQuery(conditionToQuery(newQuery)),
    resetQuery: () => setQuery(xorEncrypt({}, PASSWORD)),
  };
};
