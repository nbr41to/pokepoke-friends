'use client';
import { POKEMON_HITPOINTS_LIST } from '@/constants/types/pokemon-status';
import { useSearchQuery } from '../../_utils/use-search-query';
import { CounterForm } from './counter-form';

export const HitpointsForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChangeMin = (value: number | null) => {
    setQuery({ ...query, hitpoints: [value, query.hitpoints?.[1] || null] });
  };
  const handleOnValueChangeMax = (value: number | null) => {
    setQuery({ ...query, hitpoints: [query.hitpoints?.[0] || null, value] });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-x-3 gap-y-1 sm:flex-row">
      <span className="w-full text-center text-sm font-bold sm:w-20 sm:text-right">
        HP
      </span>
      <div className="flex items-center gap-x-1">
        <CounterForm
          options={[...POKEMON_HITPOINTS_LIST]}
          value={query.hitpoints?.[0] || null}
          onValueChange={handleOnValueChangeMin}
          label="HP最小"
        />
        <span>〜</span>
        <CounterForm
          options={[...POKEMON_HITPOINTS_LIST]}
          value={query.hitpoints?.[1] || null}
          onValueChange={handleOnValueChangeMax}
          label="HP最大"
        />
      </div>
    </div>
  );
};
