export const CARD_RARUTIES = {
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

export const CARD_RARUTIES_LIST = [
  CARD_RARUTIES.DIA_1,
  CARD_RARUTIES.DIA_2,
  CARD_RARUTIES.DIA_3,
  CARD_RARUTIES.DIA_4,
  CARD_RARUTIES.STAR_1,
  CARD_RARUTIES.STAR_2,
  CARD_RARUTIES.STAR_3,
  CARD_RARUTIES.CROWN,
  CARD_RARUTIES.PROMO,
] as const;

export const CARD_RARUTIES_LABEL = {
  [CARD_RARUTIES.DIA_1]: '♦',
  [CARD_RARUTIES.DIA_2]: '♦♦',
  [CARD_RARUTIES.DIA_3]: '♦♦♦',
  [CARD_RARUTIES.DIA_4]: '♦♦♦♦',
  [CARD_RARUTIES.STAR_1]: '★',
  [CARD_RARUTIES.STAR_2]: '★★',
  [CARD_RARUTIES.STAR_3]: '★★★',
  [CARD_RARUTIES.CROWN]: '♚',
  [CARD_RARUTIES.PROMO]: 'PROMO',
} as const;

export type CardRarity = (typeof CARD_RARUTIES)[keyof typeof CARD_RARUTIES];
