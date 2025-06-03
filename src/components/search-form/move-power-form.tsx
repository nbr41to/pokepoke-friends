'use client';
import { POKEMON_MOVE_POWER_LIST } from '@/constants/types/pokemon-status';
import { useSearchQuery } from '@/utils/use-search-query';
import { CounterForm } from './counter-form';

export const MovePowerForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChangeMin = (value: number | null) => {
    setQuery({ ...query, movePower: [value, query.movePower[1]] });
  };
  const handleOnValueChangeMax = (value: number | null) => {
    setQuery({ ...query, movePower: [query.movePower[0], value] });
  };

  return (
    <div className="flex flex-col items-center gap-x-3 gap-y-1 sm:flex-row">
      <span className="w-full text-center text-sm font-bold sm:w-20 sm:text-right">
        わざ威力
      </span>
      <div className="flex items-center gap-x-1">
        <CounterForm
          options={[...POKEMON_MOVE_POWER_LIST]}
          value={query.movePower[0]}
          onValueChange={handleOnValueChangeMin}
          label="わざ威力最小"
        />
        <span>〜</span>
        <CounterForm
          options={[...POKEMON_MOVE_POWER_LIST]}
          value={query.movePower[1]}
          onValueChange={handleOnValueChangeMax}
          label="わざ威力最大"
        />
      </div>
    </div>
  );
};
