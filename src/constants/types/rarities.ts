export const CARD_RARITIES = {
  DIA_1: 'd1', // ♦1
  DIA_2: 'd2', // ♦2
  DIA_3: 'd3', // ♦3
  DIA_4: 'd4', // ♦4
  STAR_1: 's1', // ★1
  STAR_2: 's2', // ★2
  STAR_3: 's3', // ★3
  SHINY_1: 'a1',
  SHINY_2: 'a2',
  CROWN: 'crown', // ♚
  PROMO: 'promo', // プロモ
} as const;

export const CARD_RARITIES_LIST = [
  CARD_RARITIES.DIA_1,
  CARD_RARITIES.DIA_2,
  CARD_RARITIES.DIA_3,
  CARD_RARITIES.DIA_4,
  CARD_RARITIES.STAR_1,
  CARD_RARITIES.STAR_2,
  CARD_RARITIES.STAR_3,
  CARD_RARITIES.CROWN,
  CARD_RARITIES.PROMO,
] as const;

export const CARD_RARITIES_LABEL = {
  [CARD_RARITIES.DIA_1]: '♢',
  [CARD_RARITIES.DIA_2]: '♢♢',
  [CARD_RARITIES.DIA_3]: '♢♢♢',
  [CARD_RARITIES.DIA_4]: '♢♢♢♢',
  [CARD_RARITIES.STAR_1]: '☆',
  [CARD_RARITIES.STAR_2]: '☆☆',
  [CARD_RARITIES.STAR_3]: '☆☆☆',
  [CARD_RARITIES.CROWN]: '♚',
  [CARD_RARITIES.PROMO]: 'PROMO',
} as const;

export type CardRarity = (typeof CARD_RARITIES)[keyof typeof CARD_RARITIES];
