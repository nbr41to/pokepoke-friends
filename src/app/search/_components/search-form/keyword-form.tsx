'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const KeywordForm = () => {
  const { query, setQuery } = useSearchQuery();
  const [inputValue, setInputValue] = useState(query.keywords || '');

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery({ ...query, keywords: inputValue });
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="h-[42px] w-full max-w-[694px] text-sm"
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="キーワード検索"
      />
    </form>
  );
};
