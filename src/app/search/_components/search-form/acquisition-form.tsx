'use client';

import { MultiCombobox } from '@/components/ui/multi-combobox';
import {
  ACQUISITION_OPTIONS,
  type Acquisition,
} from '@/constants/types/acquisition';
import { useSearchQuery } from '../../_utils/use-search-query';

export const AcquisitionForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnChange = (value: string[]) => {
    setQuery({ ...query, acquisition: value as Acquisition[] });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-right text-sm">収録</span>
      <div className="flex-grow">
        <MultiCombobox
          options={ACQUISITION_OPTIONS}
          placeholder="選択してください"
          emptyMessage="該当するパックはありません"
          value={query.acquisition}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};
