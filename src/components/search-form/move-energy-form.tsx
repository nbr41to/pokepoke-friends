'use client';

import CARD_DATA from '@/constants/data/all_cards.json';
import type { Card } from '@/generated/prisma';
import { useSearchQuery } from '@/utils/use-search-query';
import { CounterForm } from './counter-form';

const MOVE_ENERGY_LIST = [
  ...new Set(
    (CARD_DATA as Card[]).flatMap((card) => {
      const usedEnergyLengths: number[] = [];
      card.move1energy ? usedEnergyLengths.push(card.move1energy.length) : null;
      card.move2energy ? usedEnergyLengths.push(card.move2energy.length) : null;
      if (card.move1energy === '0' || card.move2energy === '0') {
        usedEnergyLengths.push(0);
      }
      return usedEnergyLengths;
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
