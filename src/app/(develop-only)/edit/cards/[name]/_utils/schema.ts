import {
  CardRarity,
  CardType,
  PokemonEvolveStage,
  PokemonType,
} from '@/generated/prisma';
import { z } from 'zod';

export const schema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  rarity: z.enum([
    CardRarity.d1,
    CardRarity.d2,
    CardRarity.d3,
    CardRarity.d4,
    CardRarity.s1,
    CardRarity.s2,
    CardRarity.s3,
    CardRarity.crown,
    CardRarity.promo,
  ]),
  image: z.string().min(1, { message: 'Image URL is required' }),
  cardType: z.enum([
    CardType.pokemon,
    CardType.trainers_goods,
    CardType.trainers_support,
    CardType.trainers_pokemon_tools,
  ]),
  numbering: z.string().min(1, { message: 'Numbering is required' }),
  tags: z.array(z.string()),
  packName: z.string().nullish(),
  description: z.string().nullish(),
  hp: z.coerce.number().nullish(),
  type: z
    .enum([
      PokemonType.grass,
      PokemonType.fire,
      PokemonType.water,
      PokemonType.electric,
      PokemonType.psychic,
      PokemonType.fighting,
      PokemonType.darkness,
      PokemonType.steel,
      PokemonType.dragon,
      PokemonType.normal,
    ])
    .nullish(),
  evolveStage: z
    .enum([
      PokemonEvolveStage.base,
      PokemonEvolveStage.stage1,
      PokemonEvolveStage.stage2,
    ])
    .nullish(),
  move1name: z.string().nullish(),
  move1power: z.string().nullish(),
  move1energy: z.string().nullish(),
  move1description: z.string().nullish(),
  move2name: z.string().nullish(),
  move2power: z.string().nullish(),
  move2energy: z.string().nullish(),
  move2description: z.string().nullish(),
  abilityName: z.string().nullish(),
  abilityDescription: z.string().nullish(),
  retreat: z.number().nullish(),
  weakness: z
    .enum([
      PokemonType.grass,
      PokemonType.fire,
      PokemonType.water,
      PokemonType.electric,
      PokemonType.psychic,
      PokemonType.fighting,
      PokemonType.darkness,
      PokemonType.steel,
      PokemonType.dragon,
      PokemonType.normal,
    ])
    .nullish(),
});
