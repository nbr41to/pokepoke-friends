'use client';

import { MultiCombobox } from '@/components/ui/multi-combobox';
import CARD_DATA from '@/constants/data/all_cards.json';
import { useSearchQuery } from '../../_utils/use-search-query';

// const PACK_COMMON_NAMES = ['双天の守護者'];
const acquisitionOptions = [
  ...new Set(CARD_DATA.flatMap((card) => card.packName)),
  // ...PACK_COMMON_NAMES,
].sort();

export const AcquisitionForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnChange = (value: string[]) => {
    setQuery({ ...query, packName: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-right text-sm">パック</span>
      <div className="flex-grow">
        <MultiCombobox
          options={acquisitionOptions.map((option) => ({
            label: option,
            value: option,
          }))}
          placeholder="選択してください"
          emptyMessage="該当するパックはありません"
          value={query.packName}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};
