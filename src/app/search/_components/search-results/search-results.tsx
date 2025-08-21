'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CARD_DATA from '@/constants/data/all_cards.json';
import { useFilteredCards } from '@/utils/use-filtered-cards';
import { hasSearchConditions } from '@/utils/search-utils';
import { useSearchQuery } from '@/utils/use-search-query';
import { Grid2X2, Grid3X3, Loader2, TableProperties } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { CardList } from './card-list';
import { GridList } from './grid-list';

export const SearchResults = () => {
  const { query } = useSearchQuery();
  const hasConditions = hasSearchConditions(query);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  const filteredCards = useFilteredCards({ cards: hasConditions ? CARD_DATA : [] });
  const [viewMode, setViewMode] = useQueryState('view', {
    defaultValue: '',
  });
  const allLengths = CARD_DATA.length;

  // 検索条件の変更をデバウンス
  useEffect(() => {
    if (!hasConditions) {
      setDebouncedQuery(query);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, hasConditions]);

  // 検索条件が設定されていない場合は案内メッセージを表示
  if (!hasConditions) {
    return (
      <div className="space-y-4 bg-blue-100 pt-4 pb-80">
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-2">
            <div className="font-hachiMaru text-lg text-gray-600">
              検索条件を設定してください
            </div>
            <div className="font-hachiMaru text-sm text-gray-500">
              上記のフォームから条件を選択してカードを検索できます
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-blue-100 pt-4 pb-80">
      <div className="flex justify-between gap-x-3 px-3 sm:px-6">
        <div className="font-hachiMaru text-sm flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              検索中...
            </>
          ) : (
            <>
              {filteredCards.length} / {allLengths} 件
            </>
          )}
        </div>
        <ToggleGroup
          variant="outline"
          type="single"
          value={viewMode === '' ? 'large-grid' : viewMode}
          onValueChange={(value) => {
            if (!value) return;
            setViewMode(value === 'large-grid' ? '' : value);
          }}
          className="bg-background"
        >
          <ToggleGroupItem value="large-grid" aria-label="Grid view">
            <Grid2X2 className="size-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="small-grid" aria-label="Grid view">
            <Grid3X3 className="size-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <TableProperties className="size-5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-2">
            <Loader2 className="size-8 animate-spin" />
            <div className="font-hachiMaru text-sm text-gray-600">
              カードを検索しています...
            </div>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <CardList cards={filteredCards} />
          ) : viewMode === 'small-grid' ? (
            <GridList size="small" cards={filteredCards} />
          ) : (
            <GridList size="large" cards={filteredCards} />
          )}
        </>
      )}
    </div>
  );
};
