type Type =
  | 'grass'
  | 'fire'
  | 'water'
  | 'electric'
  | 'fighting'
  | 'psychic'
  | 'darkness'
  | 'metal'
  | 'dragon'
  | 'normal';

type CardType =
  | 'pokemon'
  | 'trainer-goods'
  | 'trainer-support'
  | 'trainer-pokemon-tool';

type PokemonCard = {
  id: string;
  type: 'pokemon';
  name: string;
  image: string;
  pokemonType: Type; // ポケモンのタイプ
  weakness: string; // 弱点タイプ
  trait?: string; // 特性
  abilityName1: string; // 技1の名前
  abilityDescription1: string; // 技1の説明
  abilityEnergy1: Record<string, number>; // 技1に必要なエネルギー
  abilityName2?: string; // 技2の名前
  abilityDescription2?: string; // 技2の説明
  abilityEnergy2?: Record<string, number>; // 技2に必要なエネルギー
  retreatCost: number; // にげるエネルギー
};

type TrainerCard = {
  id: string;
  type: Exclude<CardType, 'pokemon'>;
  name: string;
  image: string;
  description: string;
};

type Card = PokemonCard | TrainerCard;
