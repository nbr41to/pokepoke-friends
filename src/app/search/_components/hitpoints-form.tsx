'use client';
import { POKEMON_HITPOINTS_LIST } from '@/constants/data/pokemon-status';
import { useSearchQuery } from '../_utils/use-search-query';
import { CounterForm } from './counter-form';

export const HitpointsForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChangeMin = (value: number) => {
    setQuery({ ...query, hitpoints: [value, query.hitpoints[1]] });
  };
  const handleOnValueChangeMax = (value: number) => {
    setQuery({ ...query, hitpoints: [query.hitpoints[0], value] });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="w-24 text-right text-sm">HP</span>
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
  );
};
