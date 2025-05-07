'use client';

import PokeBall from '@/components/icons/PokeBall';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CARD_TYPE, type CardType } from '@/constants/types/card-types';
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
      <ToggleGroupItem defaultChecked value={CARD_TYPE.POKEMON}>
        <PokeBall className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={CARD_TYPE.TRAINERS_SUPPORT}>
        <SquareUserRound className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={CARD_TYPE.TRAINERS_GOODS}>
        <Wrench className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={CARD_TYPE.TRAINERS_POKEMON_TOOLS}>
        <HardHat className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
