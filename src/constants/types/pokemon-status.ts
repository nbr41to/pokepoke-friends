export const POKEMON_MOVE_POWER_LIST = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
  180, 190, 200,
] as const;
export type PokemonMovePower = (typeof POKEMON_MOVE_POWER_LIST)[number];
export const POKEMON_MOVE_ENERGY = {
  G: 'grass', // くさ
  R: 'fire', // ほのお
  W: 'water', // みず
  L: 'electric', // でんき
  P: 'psychic', // エスパー
  F: 'fighting', // かくとう
  D: 'darkness', // あく
  M: 'steel', // はがね
  C: 'normal', // ノーマル
} as const;

export const POKEMON_HITPOINTS_LIST = [
  30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190,
] as const;
export type PokemonHitpoints = (typeof POKEMON_HITPOINTS_LIST)[number];

export const POKEMON_RETREAT_COST_LIST = [0, 1, 2, 3, 4] as const;
export type PokemonRetreatCost = (typeof POKEMON_RETREAT_COST_LIST)[number];

export const POKEMON_EVOLVE_STAGE_LIST = ['base', 'stage1', 'stage2'] as const;
export const POKEMON_EVOLVE_STAGE_LABEL = {
  base: 'たね',
  stage1: '1進化',
  stage2: '2進化',
} as const;
export type PokemonEvolveStage = (typeof POKEMON_EVOLVE_STAGE_LIST)[number];
