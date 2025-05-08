import type JA_DATA from '@/constants/data/scraped/gw/gw.json';
import type { Card } from '@/constants/types/card';
import type { Prisma } from '@/generated/prisma';

export const mergedData = (scraped: Card, ja: (typeof JA_DATA)[number]) =>
  ({
    id: scraped.cardNumber.replace(/\ #/g, 'n'),
    numbering: scraped.cardNumber.replace(/\ /g, ''),
    name: scraped.name,
    rarity: scraped.rarity,
    cardType: scraped.cardType.replace(/-/g, '_'),
    hp: scraped.hp,
    type: scraped.type,
    evolveStage: scraped.evolveStage,
    move1energy: scraped.move1energy,
    move1power: scraped.move1power,
    move2energy: scraped.move2energy,
    move2power: scraped.move2power,
    retreat: scraped.retreat,
    weakness: scraped.weakness,
    // jaData
    image: ja?.image_url ?? scraped.image,
    description: ja?.description ?? scraped.description,
    move1name: ja?.move1_name ?? scraped.move1name,
    move1description: ja?.move1_description ?? scraped.move1description,
    move2name: ja?.move2_name ?? scraped.move2name,
    move2description: ja?.move2_description ?? scraped.move2description,
    abilityName: ja?.ability_name ?? scraped.abilityName,
    abilityDescription: ja?.ability_effect ?? scraped.abilityDescription,
  }) as Prisma.CardCreateInput;
