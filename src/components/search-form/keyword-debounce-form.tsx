'use client';

import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/utils/use-search-query';
import { useEffect, useRef, useState } from 'react';

export const KeywordDebounceForm = () => {
  const { query, setQuery } = useSearchQuery();
  const [inputValue, setInputValue] = useState(query.keywords || '');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnSubmit = (e?: React.FormEvent, valueToSubmit?: string) => {
    if (e) {
      e.preventDefault();
    }
    const keywordValue =
      valueToSubmit !== undefined ? valueToSubmit : inputValue;
    setQuery({ ...query, keywords: keywordValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

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
    <form
      onSubmit={handleOnSubmit}
      className="h-[42px] w-full max-w-[694px] text-sm"
    >
      <Input
        className="h-[42px]"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="キーワード検索"
      />
    </form>
  );
};
