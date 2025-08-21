'use client';

import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/utils/use-search-query';
import { useEffect, useRef, useState } from 'react';

export const KeywordDebounceForm = () => {
  const { query, setQuery } = useSearchQuery();
  const [inputValue, setInputValue] = useState(query.keywords || '');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnSubmit = (e?: React.FormEvent, valueToSubmit?: string) => {
    if (e) {
      e.preventDefault();
    }
    const keywordValue =
      valueToSubmit !== undefined ? valueToSubmit : inputValue;
    
    setIsSearching(false); // Reset searching state when submitting
    setQuery({ ...query, keywords: keywordValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsSearching(true); // Show loading state while typing

    // 既存のタイマーをクリア
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 0.5秒後に自動でsubmitを実行（現在の値を明示的に渡す）
    debounceTimeoutRef.current = setTimeout(() => {
      handleOnSubmit(undefined, newValue);
    }, 500);
  };

  useEffect(() => {
    // 入力値が空の場合は、queryからkeywordsを削除
    if (!query.keywords) {
      setInputValue('');
    }
  }, [query.keywords]);

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleOnSubmit} className="h-[42px] w-full text-sm">
      <div className="relative">
        <Input
          type="search"
          className="h-[42px] pr-10"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="キーワード検索"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
};
