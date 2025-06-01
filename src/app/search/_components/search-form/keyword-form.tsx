'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchQuery } from '../../_utils/use-search-query';

export const KeywordForm = () => {
  const { query, setQuery } = useSearchQuery();
  const [inputValue, setInputValue] = useState(query.keywords || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({ ...query, keywords: inputValue });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, query, setQuery]);

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="キーワード検索"
      className="h-[42px] w-full max-w-[694px] text-sm"
    />
  );
};
