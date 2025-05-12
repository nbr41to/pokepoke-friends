'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CARD_DATA from '@/constants/data/all_cards.json';
import { Grid2X2, Grid3X3, TableProperties } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { CardList } from './card-list';
import { GridList } from './grid-list';
import { useFilteredCards } from './use-filtered-cards';

export const SearchResults = () => {
  const filteredCards = useFilteredCards();
  const [viewMode, setViewMode] = useQueryState('view', {
    defaultValue: '',
  });
  // const [viewMode, setViewMode] = useState<
  //   'small-grid' | 'large-grid' | 'list'
  // >('large-grid');
  const allLengths = CARD_DATA.length;

  return (
    <div className="space-y-4 bg-blue-100 py-4">
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
