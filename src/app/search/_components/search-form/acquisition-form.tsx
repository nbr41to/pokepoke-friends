'use client';

import { MultiCombobox } from '@/components/ui/multi-combobox';
import CARD_DATA from '@/constants/data/all_cards.json';
import { ACQUISITION_LABEL } from '@/constants/types/acquisition';
import { useSearchQuery } from '../../_utils/use-search-query';

// const PACK_COMMON_NAMES = ['双天の守護者'];
const acquisitionOptions = [
  ...new Set([
    ...Object.values(ACQUISITION_LABEL),
    ...CARD_DATA.flatMap((card) => card.packName),
  ]),
];

export const AcquisitionForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnChange = (value: string[]) => {
    setQuery({ ...query, packName: value });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-x-3 gap-y-1 sm:flex-row">
      <span className="w-full text-center text-sm font-bold sm:w-20 sm:text-right">
        パック
      </span>

      <MultiCombobox
        className="sm:max-w-[600px]"
        options={acquisitionOptions.map((option) => ({
          label: option,
          value: option,
        }))}
        placeholder="選択してください"
        emptyMessage="該当するパックはありません"
        value={query.packName || []}
        onChange={handleOnChange}
      />
    </div>
  );
};
