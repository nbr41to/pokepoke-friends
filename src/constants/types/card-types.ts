export const CARD_TYPE = {
  POKEMON: 'pokemon', // ポケモン
  TRAINERS_GOODS: 'trainers_goods', // トレーナーズ | グッズ
  TRAINERS_SUPPORT: 'trainers_support', // トレーナーズ | サポート
  TRAINERS_POKEMON_TOOLS: 'trainers_pokemon_tools', // トレーナーズ | ポケモンのどうぐ
} as const;

export const CARD_TYPE_LIST = [
  CARD_TYPE.POKEMON,
  CARD_TYPE.TRAINERS_GOODS,
  CARD_TYPE.TRAINERS_SUPPORT,
  CARD_TYPE.TRAINERS_POKEMON_TOOLS,
] as const;

export const CARD_TYPE_LABEL = {
  [CARD_TYPE.POKEMON]: 'ポケモン',
  [CARD_TYPE.TRAINERS_GOODS]: 'トレーナーズ | グッズ',
  [CARD_TYPE.TRAINERS_SUPPORT]: 'トレーナーズ | サポート',
  [CARD_TYPE.TRAINERS_POKEMON_TOOLS]: 'トレーナーズ | ポケモンのどうぐ',
} as const;

export type CardType = (typeof CARD_TYPE)[keyof typeof CARD_TYPE];
