'use client';
import { POKEMON_HITPOINTS_LIST } from '@/constants/types/pokemon-status';
import { useSearchQuery } from '../../_utils/use-search-query';
import { CounterForm } from './counter-form';

export const HitpointsForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChangeMin = (value: number | null) => {
    setQuery({ ...query, hitpoints: [value, query.hitpoints[1]] });
  };
  const handleOnValueChangeMax = (value: number | null) => {
    setQuery({ ...query, hitpoints: [query.hitpoints[0], value] });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-right text-sm">HP</span>
      <div className="flex flex-grow items-center gap-x-1">
        <CounterForm
          options={[...POKEMON_HITPOINTS_LIST]}
          value={query.hitpoints[0]}
          onValueChange={handleOnValueChangeMin}
          label="HP最小"
        />
        <span>〜</span>
        <CounterForm
          options={[...POKEMON_HITPOINTS_LIST]}
          value={query.hitpoints[1]}
          onValueChange={handleOnValueChangeMax}
          label="HP最大"
        />
      </div>
    </div>
  );
};
