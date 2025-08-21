import type { CardRarity } from '@/constants/types/rarities';
import type {
  CardType,
  PokemonEvolveStage,
  PokemonType,
} from '@/generated/prisma';

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

/**
 * 値が空(デフォルト状態)かどうかを判定するヘルパー関数
 */
const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value === '';
  if (Array.isArray(value)) {
    // 通常の配列の場合
    if (value.length === 0) return true;
    // タプル [null, null] のような場合
    if (value.length === 2 && value[0] === null && value[1] === null) return true;
    return false;
  }
  return false;
};

/**
 * 検索条件が設定されているかどうかを判定する
 * すべてがデフォルト値の場合はfalseを返す
 */
export const hasActiveSearchConditions = (condition: Condition): boolean => {
  return Object.values(condition).some(value => !isEmpty(value));
};