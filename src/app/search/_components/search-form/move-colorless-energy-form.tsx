'use client';

import { EnergyIcons } from '@/components/enegy-icons';
import CARD_DATA from '@/constants/data/all_cards.json';
import type { Card } from '@/generated/prisma';
import { useSearchQuery } from '../../_utils/use-search-query';
import { CounterForm } from './counter-form';

const MOVE_COLORLESS_ENERGY_LIST = [
  ...new Set(
    (CARD_DATA as Card[]).flatMap((card) => {
      const move1Energy = card.move1energy
        ? card.move1energy.split('').filter((e) => e !== 'C').length
        : null;
      const move2Energy = card.move2energy
        ? card.move2energy.split('').filter((e) => e !== 'C').length
        : null;
      return [move1Energy, move2Energy];
    }),
  ),
]
  .filter((value) => value !== null)
  .sort() as number[];

export const MoveColorlessEnergyForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: number | null) => {
    setQuery({ ...query, moveColorlessEnergy: value });
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="inline-flex w-20 items-center gap-x-1 text-right text-sm font-bold">
        わざの
        <EnergyIcons energies="C" />数
      </span>
      <div className="flex items-center gap-x-1">
        <CounterForm
          options={[...MOVE_COLORLESS_ENERGY_LIST]}
          value={query.moveColorlessEnergy}
          onValueChange={handleOnValueChange}
          label="わざのノーマルエネ数"
          range={1}
        />
      </div>
    </div>
  );
};
