'use client';

import { POKEMON_RETREAT_COST_LIST } from '@/constants/types/pokemon-status';
import { useSearchQuery } from '../../_utils/use-search-query';
import { CounterForm } from './counter-form';

export const RetreatCostForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: number | null) => {
    setQuery({ ...query, retreatCost: value });
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="w-20 text-right text-sm font-bold">にげる</span>
      <div className="flex items-center gap-x-1">
        <CounterForm
          options={[...POKEMON_RETREAT_COST_LIST]}
          value={query.retreatCost ?? null}
          onValueChange={handleOnValueChange}
          label="にげる"
          range={1}
        />
      </div>
    </div>
  );
};
