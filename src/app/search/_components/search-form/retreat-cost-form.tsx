'use client';

import { POKEMON_RETREAT_COST_LIST } from '@/constants/types/pokemon-status';
import { useSearchQuery } from '../../_utils/use-search-query';
import { CounterForm } from './counter-form';

export const RetreatCostForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: number | null) => {
    setQuery({ ...query, retreteCost: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-right text-sm">にげる</span>
      <div className="flex flex-grow items-center gap-x-1">
        <CounterForm
          options={[...POKEMON_RETREAT_COST_LIST]}
          value={query.retreteCost}
          onValueChange={handleOnValueChange}
          label="にげる"
          renge={1}
        />
      </div>
    </div>
  );
};
