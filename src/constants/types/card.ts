import type { CardType } from './card-types';
import type { PokemonEvolveStage } from './pokemon-status';
import type { PokemonType } from './pokemon-types';

export type MinimumCardData = {
  id: string; // カード番号 A1#001
  name: string; // カードの名前
  image: string; // カードの画像URL
};

export type Card = {
  id: number; // カードの連番
  cardNumber: string; // カード番号 A1 #001
  name: string; // カードの名前
  rarity: string; // カードのレアリティ
  image: string; // カードの画像URL
  cardType: CardType; // カードの種類

  description: string | null;
  hp: number | null; // HP
  type: PokemonType | null;
  evolveStage: PokemonEvolveStage | null; // 進化段階
  move1name: string | null; // わざ1の名前
  move1energy: string | null; // わざ1の必要エネルギー
  move1power: string | null; // わざ1の威力
  move1description: string | null; // わざ1の説明
  move2name: string | null; // わざ2の名前
  move2energy: string | null; // わざ2の必要エネルギー
  move2power: string | null; // わざ2の威力
  move2description: string | null; // わざ2の説明
  abilityName: string | null; // 特性
  abilityDescription: string | null; // 特性
  retreat: number | null; // にげるエネルギー
  weakness: PokemonType | null; // 弱点タイプ
};
