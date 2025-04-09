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

type BaseCard = {
  id: string;
  type: CardType;
  name: string;
  image: string;
};

type PokemonCard = Exclude<BaseCard, 'type'> & {
  type: Extract<CardType, 'pokemon'>;
  pokemonType: Type; // ポケモンのタイプ
  trait?: string; // 特性
  abilityName1: string; // 技1の名前
  abilityDescription1: string; // 技1の説明
  abilityEnergy1: Record<string, number>; // 技1に必要なエネルギー
  abilityDamage1: number | null; // 技1のダメージ
  abilityName2?: string; // 技2の名前
  abilityDescription2?: string; // 技2の説明
  abilityEnergy2?: Record<string, number>; // 技2に必要なエネルギー
  abilityDamage2?: number | null; // 技2のダメージ
  retreatCost: number; // にげるエネルギー
  weakness: string | null; // 弱点タイプ
};

type TrainerCard = {
  id: string;
  type: Exclude<CardType, 'pokemon'>;
  description: string;
};

type Card = PokemonCard | TrainerCard;
