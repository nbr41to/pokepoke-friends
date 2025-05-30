export const ACQUISITION = {
  A1: 'A1', // A1
  A1_a: 'A1a', // A1a
  A2: 'A2', // A2
  A2_a: 'A2a', // A2a
  A2_b: 'A2b', // A2b
  A3: 'A3', // A3
  A3_a: 'A3a', // A3a
  P_A: 'P-A', // P-A
} as const;

export const ACQUISITION_LIST = [
  ACQUISITION.A1,
  ACQUISITION.A1_a,
  ACQUISITION.A2,
  ACQUISITION.A2_a,
  ACQUISITION.A2_b,
  ACQUISITION.A3,
  ACQUISITION.A3_a,
  ACQUISITION.P_A,
] as const;

export const ACQUISITION_LABEL = {
  [ACQUISITION.A1]: '最強の遺伝子',
  [ACQUISITION.A1_a]: '幻のいる島',
  [ACQUISITION.A2]: '時空の激闘',
  [ACQUISITION.A2_a]: '超克の光',
  [ACQUISITION.A2_b]: 'シャイニングハイ',
  [ACQUISITION.A3]: '双天の守護者',
  [ACQUISITION.A3_a]: '異次元クライシス',
  [ACQUISITION.P_A]: 'PROMO-A',
} as const;

export const ACQUISITION_OPTIONS = [
  {
    value: 'A1',
    label: '最強の遺伝子',
    kana: 'さいきょうのいでんし',
    romaji: 'saikyou no idenshi',
  },
  {
    value: 'A1a',
    label: '幻のいる島',
    kana: 'まぼろしのいるしま',
    romaji: 'maboroshi no iru shima',
  },
  {
    value: 'A2',
    label: '時空の激闘',
    kana: 'じくうのげきとう',
    romaji: 'jikuu no gekitou',
  },
  {
    value: 'A2a',
    label: '超克の光',
    kana: 'ちょうこくのひかり',
    romaji: 'choukoku no hikari',
  },
  {
    value: 'A2b',
    label: 'シャイニングハイ',
    kana: 'しゃいにんぐはい',
    romaji: 'shaininguhai',
  },
  {
    value: 'A3',
    label: '双天の守護者',
    kana: 'そうてんのしゅごしゃ',
    romaji: 'souten no shugo sha',
  },
  {
    value: 'A3a',
    label: '異次元クライシス',
    kana: 'いじげんくらいしす',
    romaji: 'izigen kuraisisu',
  },
  { value: 'P-A', label: 'Promo-A', kana: 'ぷろもえー', romaji: 'puromo a' },
];

export type Acquisition = (typeof ACQUISITION_LIST)[number];
