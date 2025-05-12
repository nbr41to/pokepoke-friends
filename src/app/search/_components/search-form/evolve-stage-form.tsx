'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PokemonEvolveStage } from '@/generated/prisma';
import { useSearchQuery } from '../../_utils/use-search-query';

export const EvolveStageForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string[]) => {
    setQuery({ ...query, evolveStages: value as PokemonEvolveStage[] });
  };

  return (
    <ToggleGroup
      type="multiple"
      value={query.evolveStages}
      onValueChange={handleOnValueChange}
      className="border"
    >
      <ToggleGroupItem defaultChecked value={PokemonEvolveStage.base}>
        たね
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={PokemonEvolveStage.stage1}>
        1進化
      </ToggleGroupItem>
      <ToggleGroupItem defaultChecked value={PokemonEvolveStage.stage2}>
        2進化
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
