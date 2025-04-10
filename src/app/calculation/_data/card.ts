export const pokemonBasic = {
  type: 'pokemon-basic',
  name: 'たねポケモン',
  effect: null,
  function: null,
};
export const pokemonEvolve1 = {
  type: 'pokemon-evolve1',
  name: '1進化',
  effect: null,
  function: null,
};
export const pokemonEvolve2 = {
  type: 'pokemon-evolve2',
  name: '2進化',
  effect: null,
  function: null,
};
export const pokemonOther = {
  type: 'pokemon-other',
  name: '無関係なポケモン',
  effect: null,
  function: null,
};
export const pokemonBasicOther = {
  type: 'pokemon-basic-other',
  name: '無関係なたねポケモン',
  effect: null,
  function: null,
};
export const tradePokemon = {
  type: 'goods',
  name: 'ポケモン通信',
  effect:
    '自分の手札からポケモンを1枚選び、山札にあるランダムなポケモン1枚と入れ替える。',
  function: 'trade',
};
export const draw2 = {
  type: 'support',
  name: '博士の研究',
  effect: '自分の山札を2枚引く。',
  function: 'draw2',
};
export const mulligan = {
  type: 'support',
  name: 'ナンジャモ',
  effect:
    'おたがいのプレイヤーは、それぞれの手札をすべて山札にもどす。その後、それぞれもどした枚数ぶん、山札を引く。',
  function: 'mulligan',
};
export const searchBasic = {
  type: 'goods',
  name: 'モンスターボール',
  effect: '自分の山札からたねポケモンをランダムに1枚、手札に加える。',
  function: 'search-basic',
};
export const other = {
  type: 'other',
  name: '無関係なカード',
  effect: null,
  function: null,
};

export const cards = [
  pokemonBasic,
  pokemonBasic,
  pokemonEvolve1,
  pokemonEvolve1,
  pokemonEvolve2,
  pokemonEvolve2,
  tradePokemon,
  draw2,
  draw2,
  searchBasic,
  searchBasic,
];
