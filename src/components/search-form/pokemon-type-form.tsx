'use client';

import type { PokemonType } from '@/constants/types/pokemon-types';
import { useSearchQuery } from '@/utils/use-search-query';
import { MultiSelectPokemonType } from '../multi-select-pokemon-type';

export const PokemonTypeForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string[]) => {
    setQuery({ ...query, pokemonTypes: value as PokemonType[] });
  };

  return (
    <div className="w-full">
      <MultiSelectPokemonType
        values={query.pokemonTypes}
        onChange={handleOnValueChange}
      />
    </div>
  );
};
