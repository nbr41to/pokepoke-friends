'use client';

import CARD_DATA from '@/constants/data/all_cards.json';
import { useSearchQuery } from '@/utils/use-search-query';
import { CounterForm } from './counter-form';

const MOVE_ENERGY_LIST = [
  ...new Set(
    CARD_DATA.flatMap((card) => {
      const move1Energy = card.move1energy ? card.move1energy.length : null;
      const move2Energy = card.move2energy ? card.move2energy.length : null;
      return [move1Energy, move2Energy];
    }),
  ),
]
  .filter((value) => value !== null)
  .sort() as number[];

export const MoveEnergyForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: number | null) => {
    setQuery({ ...query, moveEnergy: value });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-right text-sm font-bold">わざエネ数</span>
      <div className="flex items-center gap-x-1">
        <CounterForm
          options={[...MOVE_ENERGY_LIST]}
          value={query.moveEnergy}
          onValueChange={handleOnValueChange}
          label="わざのエネ数"
          range={1}
        />
      </div>
    </div>
  );
};
