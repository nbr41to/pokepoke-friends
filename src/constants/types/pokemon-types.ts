export const POKEMON_TYPE = {
  GRASS: 'grass', // くさ
  FIRE: 'fire', // ほのお
  WATER: 'water', // みず
  ELECTRIC: 'electric', // でんき
  PSYCHIC: 'psychic', // エスパー
  FIGHTING: 'fighting', // かくとう
  DARKNESS: 'darkness', // あく
  STEEL: 'steel', // はがね
  DRAGON: 'dragon', // ドラゴン
  NORMAL: 'normal', // ノーマル
} as const;

export const POKEMON_TYPE_LIST = [
  POKEMON_TYPE.GRASS,
  POKEMON_TYPE.FIRE,
  POKEMON_TYPE.WATER,
  POKEMON_TYPE.ELECTRIC,
  POKEMON_TYPE.PSYCHIC,
  POKEMON_TYPE.FIGHTING,
  POKEMON_TYPE.DARKNESS,
  POKEMON_TYPE.STEEL,
  POKEMON_TYPE.DRAGON,
  POKEMON_TYPE.NORMAL,
] as const;

export const POKEMON_TYPE_LABEL = {
  [POKEMON_TYPE.GRASS]: 'くさ',
  [POKEMON_TYPE.FIRE]: 'ほのお',
  [POKEMON_TYPE.WATER]: 'みず',
  [POKEMON_TYPE.ELECTRIC]: 'でんき',
  [POKEMON_TYPE.PSYCHIC]: 'エスパー',
  [POKEMON_TYPE.FIGHTING]: 'かくとう',
  [POKEMON_TYPE.DARKNESS]: 'あく',
  [POKEMON_TYPE.STEEL]: 'はがね',
  [POKEMON_TYPE.DRAGON]: 'ドラゴン',
  [POKEMON_TYPE.NORMAL]: 'ノーマル',
} as const;

export const POKEMON_TYPE_SYMBOL = {
  [POKEMON_TYPE.GRASS]: 'G',
  [POKEMON_TYPE.FIRE]: 'R',
  [POKEMON_TYPE.WATER]: 'W',
  [POKEMON_TYPE.ELECTRIC]: 'L',
  [POKEMON_TYPE.PSYCHIC]: 'P',
  [POKEMON_TYPE.FIGHTING]: 'F',
  [POKEMON_TYPE.DARKNESS]: 'D',
  [POKEMON_TYPE.STEEL]: 'M',
  [POKEMON_TYPE.DRAGON]: '',
  [POKEMON_TYPE.NORMAL]: 'C',
} as const;

export type PokemonType = (typeof POKEMON_TYPE)[keyof typeof POKEMON_TYPE];
