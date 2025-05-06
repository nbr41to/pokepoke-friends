import type { CardType } from './card-types';
import type { PokemonEvolveStage } from './pokemon-status';
import type { PokemonType } from './pokemon-types';

type CardBase = {
  id: number; // カードの連番
  cardNumber: string; // カード番号 A1/001/226
  name: string; // カードの名前
  nameEn: string; // カードの英語名
  rarity: string; // カードのレアリティ
  image: string; // カードの画像URL
};
export type PokemonCard = CardBase & {
  cardType: Extract<CardType, 'pokemon'>; // カードの種類
  hp: number; // HP
  type: PokemonType;
  evolveStage: PokemonEvolveStage; // 進化段階
  move1name: string; // わざ1の名前
  move1energy: string; // わざ1の必要エネルギー
  move1power: number; // わざ1の威力
  move1description: string | null; // わざ1の説明
  move2name: string | null; // わざ2の名前
  move2energy: string | null; // わざ2の必要エネルギー
  move2power: number | null; // わざ2の威力
  move2description: string | null; // わざ2の説明
  abilityName: string | null; // 特性
  abilityDescription: string | null; // 特性
  retreat: number; // にげるエネルギー
  weakness: PokemonType | null; // 弱点タイプ
};

type TrainersCard = CardBase & {
  cardType: Exclude<CardType, 'pokemon'>; // カードの種類
  description: string; // カードの効果
};

export type Card = PokemonCard | TrainersCard;
