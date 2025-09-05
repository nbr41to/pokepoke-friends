import { useSearchQuery } from './use-search-query';

/**
 * 検索条件がデフォルト状態（何も設定されていない状態）かどうかを判定する
 */
export const isDefaultSearchCondition = (condition: ReturnType<typeof useSearchQuery>['query']): boolean => {
  // 配列の条件をチェック
  const arrayConditions = ['cardTypes', 'pokemonTypes', 'evolveStages', 'rarities', 'packName'] as const;
  for (const key of arrayConditions) {
    if (condition[key].length > 0) {
      return false;
    }
  }

  // 範囲の条件をチェック
  const rangeConditions = ['hitpoints', 'movePower'] as const;
  for (const key of rangeConditions) {
    const [min, max] = condition[key];
    if (min !== null || max !== null) {
      return false;
    }
  }

  // 単一値の条件をチェック
  const singleConditions = ['moveEnergy', 'moveColorlessEnergy', 'hasAbility', 'retreatCost'] as const;
  for (const key of singleConditions) {
    if (condition[key] !== null) {
      return false;
    }
  }

  // キーワードをチェック
  if (condition.keywords.trim() !== '') {
    return false;
  }

  return true;
};

/**
 * 検索条件に実際の条件が設定されているかどうかを判定する
 */
export const hasSearchConditions = (condition: ReturnType<typeof useSearchQuery>['query']): boolean => {
  return !isDefaultSearchCondition(condition);
};