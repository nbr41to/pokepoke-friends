'use client';

import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/utils/use-search-query';
import { useEffect, useState } from 'react';

export const KeywordForm = () => {
  const { query, setQuery } = useSearchQuery();
  const [inputValue, setInputValue] = useState(query.keywords || '');

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery({ ...query, keywords: inputValue });
  };

  useEffect(() => {
    // 入力値が空の場合は、queryからkeywordsを削除
    if (!query.keywords) {
      setInputValue('');
    }
  }, [query.keywords]);

  return (
    <form
      onSubmit={handleOnSubmit}
      className="h-[42px] w-full max-w-[694px] text-sm"
    >
      <Input
        className="h-[42px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="キーワード検索"
      />
    </form>
  );
};
