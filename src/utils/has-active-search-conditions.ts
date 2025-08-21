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
 * 検索条件が設定されているかどうかを判定する
 * すべてがデフォルト値の場合はfalseを返す
 */
export const hasActiveSearchConditions = (condition: Condition): boolean => {
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
  } = condition;

  // 配列系の条件をチェック
  if (cardTypes.length > 0) return true;
  if (pokemonTypes.length > 0) return true;
  if (rarities.length > 0) return true;
  if (evolveStages.length > 0) return true;
  if (packName.length > 0) return true;

  // 範囲系の条件をチェック
  if (hitpoints[0] !== null || hitpoints[1] !== null) return true;
  if (movePower[0] !== null || movePower[1] !== null) return true;

  // 単一値系の条件をチェック
  if (moveEnergy !== null) return true;
  if (moveColorlessEnergy !== null) return true;
  if (retreatCost !== null) return true;
  if (hasAbility !== null) return true;

  // キーワード検索をチェック
  if (keywords !== '') return true;

  return false;
};