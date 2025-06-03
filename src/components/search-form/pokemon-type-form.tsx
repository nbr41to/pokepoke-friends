'use client';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  POKEMON_TYPE_LIST,
  type PokemonType,
} from '@/constants/types/pokemon-types';
import { cn } from '@/utils/classnames';
import { useSearchQuery } from '@/utils/use-search-query';
import { X } from 'lucide-react';
import Image from 'next/image';

export const PokemonTypeForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string[]) => {
    setQuery({ ...query, pokemonTypes: value as PokemonType[] });
  };
  const isCleared = query.pokemonTypes.length === 0;

  return (
    <div className="flex min-w-[402px] items-center gap-x-1">
      <ToggleGroup
        type="multiple"
        value={query.pokemonTypes}
        onValueChange={handleOnValueChange}
        className="border"
      >
        {POKEMON_TYPE_LIST.map((type, index) => (
          <ToggleGroupItem
            key={type}
            value={type}
            aria-label={`Toggle ${type}`}
            className="flex-none data-[state=off]:opacity-60 data-[state=off]:grayscale"
          >
            <Image
              src={`/type${index + 1}.png`}
              alt={`Type ${type}`}
              width={20}
              height={20}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setQuery({
            ...query,
            pokemonTypes: isCleared ? [...POKEMON_TYPE_LIST] : [],
          });
        }}
      >
        <span className={cn('text-gray-600', isCleared ? 'block' : 'hidden')}>
          ALL
        </span>
        <X className={cn('size-5', isCleared ? 'hidden' : 'block')} />
      </Button>
    </div>
  );
};
