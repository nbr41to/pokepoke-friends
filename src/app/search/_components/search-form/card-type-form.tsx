'use client';

import PokeBall from '@/components/icons/PokeBall';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { CardType } from '@/constants/types/card-types';
import { $Enums } from '@/generated/prisma';
import { HardHat, SquareUserRound, Wrench } from 'lucide-react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const CardTypeForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string[]) => {
    setQuery({ ...query, cardTypes: value as CardType[] });
  };

  return (
    <ToggleGroup
      type="multiple"
      value={query.cardTypes}
      onValueChange={handleOnValueChange}
      className="border"
    >
      <ToggleGroupItem defaultChecked value={$Enums.CardType.pokemon}>
        <PokeBall className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={$Enums.CardType.trainers_support}>
        <SquareUserRound className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={$Enums.CardType.trainers_goods}>
        <Wrench className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        defaultChecked
        value={$Enums.CardType.trainers_pokemon_tools}
      >
        <HardHat className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
