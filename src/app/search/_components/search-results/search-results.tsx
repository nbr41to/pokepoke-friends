'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CARD_DATA from '@/constants/data/all_cards.json';
import { useFilteredCards } from '@/utils/use-filtered-cards';
import { Grid2X2, Grid3X3, TableProperties, Search, Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { CardList } from './card-list';
import { GridList } from './grid-list';

export const SearchResults = () => {
  const { filteredCards, isLoading, hasActiveConditions } = useFilteredCards({ cards: CARD_DATA });
  const [viewMode, setViewMode] = useQueryState('view', {
    defaultValue: '',
  });
  const allLengths = CARD_DATA.length;

  // 検索条件がない場合の表示
  if (!hasActiveConditions) {
    return (
      <div className="space-y-4 bg-blue-100 pt-4 pb-80">
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <Search className="size-16 text-gray-400 mb-4" />
          <h3 className="font-hachiMaru text-lg text-gray-600 mb-2">検索条件を設定してください</h3>
          <p className="text-sm text-gray-500 text-center">
            上記の検索フォームから条件を選択すると、{allLengths} 枚のカードから絞り込んで表示されます。
          </p>
        </div>
      </div>
    );
  }

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="space-y-4 bg-blue-100 pt-4 pb-80">
        <div className="flex justify-between gap-x-3 px-3 sm:px-6">
          <div className="font-hachiMaru text-sm">
            検索中... / {allLengths} 件
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <Loader2 className="size-8 text-blue-600 animate-spin mb-4" />
          <p className="font-hachiMaru text-sm text-gray-600">検索条件に合うカードを探しています...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-blue-100 pt-4 pb-80">
      <div className="flex justify-between gap-x-3 px-3 sm:px-6">
        <div className="font-hachiMaru text-sm">
          {filteredCards.length} / {allLengths} 件
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

      {viewMode === 'list' ? (
        <CardList cards={filteredCards} />
      ) : viewMode === 'small-grid' ? (
        <GridList size="small" cards={filteredCards} />
      ) : (
        <GridList size="large" cards={filteredCards} />
      )}
    </div>
  );
};
