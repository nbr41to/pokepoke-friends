type CardType =
  | 'pokemon'
  | 'trainer-goods'
  | 'trainer-support'
  | 'trainer-pokemon-tool';

type PokemonCard = {
  id: string;
  type: CardType;
  name: string;
  image: string;
  hp: number;
  weakness: string;
  ability1: string; // 技1の名前
  abilityDescription1: string; // 技1の説明
  abilityEnergy1: Record<string, number>; // 技1に必要なエネルギー
  ability2?: string; // 技2の名前
  abilityDescription2?: string; // 技2の説明
  abilityEnergy2?: Record<string, number>; // 技2に必要なエネルギー
  trait?: string; // 特性
};
