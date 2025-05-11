'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid2X2, Grid3X3, TableProperties } from 'lucide-react';
import { useState } from 'react';
import { CardList } from './card-list';
import { GridList } from './grid-list';
import { useFilterdCards } from './use-filterd-cards';

export const SearchResults = () => {
  const filteredCards = useFilterdCards();
  const [viewMode, setViewMode] = useState<
    'small-grid' | 'large-grid' | 'list'
  >('large-grid');

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-end gap-x-3">
        <div>{filteredCards.length} cards found</div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) =>
            setViewMode(value as 'small-grid' | 'large-grid' | 'list')
          }
          className="border"
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

      {viewMode === 'small-grid' && (
        <GridList size="small" cards={filteredCards} />
      )}
      {viewMode === 'large-grid' && (
        <GridList size="large" cards={filteredCards} />
      )}
      {viewMode === 'list' && <CardList cards={filteredCards} />}
    </div>
  );
};
