type Energy =
  | 'grass' // 草
  | 'fire' // 炎
  | 'water' // 水
  | 'electric' // 雷
  | 'fighting' // 闘
  | 'psychic' // 超
  | 'darkness' // 悪
  | 'metal'; // 鋼

type PokemonType =
  | Energy
  | 'dragon' // ドラゴン
  | 'normal'; // ノーマル

type CardType =
  | 'pokemon' // ポケモン
  | 'trainer-goods' // トレーナーズ | グッズ
  | 'trainer-support' // トレーナーズ | サポート
  | 'trainer-pokemon-tools'; // トレーナーズ | ポケモンのどうぐ

type SearchKey = '';
type SearchType = {
  key: SearchKey; // 検索キー
  label: string; // ラベル
};

type CardBase = {
  id: string;
  name: string;
  image: string;
};

type PokemonMove = {
  name: string; // わざの名前
  description: string; // 説明
  energy: Record<Energy, number>; // エネルギーの種類と枚数
  damage: number | null; // ダメージ
};

type PokemonCard = Exclude<CardBase, 'type'> & {
  cardType: Extract<CardType, 'pokemon'>;
  pokemonType: PokemonType; // ポケモンのタイプ
  ability?: string; // 特性
  move1: PokemonMove; // 技1
  move2: PokemonMove | null; // 技2
  escapeCost: number; // にげるエネルギー
  weakness: PokemonType | null; // 弱点タイプ
};

type TrainerCard = {
  id: string;
  cardType: Exclude<CardType, 'pokemon'>;
  description: string;
};

type Card = PokemonCard | TrainerCard;
