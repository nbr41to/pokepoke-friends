'use client';

import { Input } from '@/components/ui/input';
import { useSearchQuery } from '../../_utils/use-search-query';

export const KeywordForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string) => {
    setQuery({ ...query, keywords: value });
  };

  return (
    <Input
      value={query.keywords}
      onChange={(e) => handleOnValueChange(e.target.value)}
      placeholder="キーワード検索"
      className="w-full max-w-[300px] text-sm"
    />
  );
};
