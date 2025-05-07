'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid, TableProperties } from 'lucide-react';
import { useState } from 'react';
import { CardList } from './card-list';
import { GridList } from './grid-list';
import { useFilterdCards } from './use-filterd-cards';

export const SearchResults = () => {
  const filteredCards = useFilterdCards();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-end gap-x-3">
        <div>{filteredCards.length} cards found</div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
          className="border"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid className="size-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <TableProperties className="size-5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'grid' && <GridList cards={filteredCards} />}
      {viewMode === 'list' && <CardList cards={filteredCards} />}
    </div>
  );
};
