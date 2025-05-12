'use client';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  CARD_RARITIES_LIST,
  type CardRarity,
} from '@/constants/types/rarities';
import { cn } from '@/utils/classnames';
import { Crown, Diamond, Star, X } from 'lucide-react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const RarityForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnValueChange = (value: string[]) => {
    setQuery({ ...query, rarities: value as CardRarity[] });
  };
  const isCleared = query.rarities.length === 0;

  return (
    <div className="flex items-center gap-x-1">
      <ToggleGroup
        type="multiple"
        value={query.rarities}
        onValueChange={handleOnValueChange}
        className="border"
      >
        {CARD_RARITIES_LIST.map((rarity) => (
          <ToggleGroupItem
            key={rarity}
            value={rarity}
            aria-label={`Toggle ${rarity}`}
            className={cn(
              'h-12 flex-none py-1 data-[state=off]:opacity-60 data-[state=off]:grayscale',
            )}
          >
            {rarity.startsWith('d') && (
              <div className="flex flex-col items-center justify-center">
                <Diamond className="text-gray-500" />
                <span>{rarity.slice(1)}</span>
              </div>
            )}
            {rarity.startsWith('s') && (
              <div className="flex flex-col items-center justify-center">
                <Star className="text-yellow-500" />
                <span>{rarity.slice(1)}</span>
              </div>
            )}
            {rarity === 'crown' && <Crown className="text-yellow-500" />}
            {rarity === 'promo' && (
              <span className="w-full grow text-xs">PROMO</span>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setQuery({
            ...query,
            rarities: isCleared ? [...CARD_RARITIES_LIST] : [],
          });
        }}
      >
        <span className={cn('text-gray-600', isCleared ? 'block' : 'hidden')}>
          ALL
        </span>
        <X className={cn('size-5', isCleared ? 'hidden' : 'block')} />
      </Button>
    </div>
  );
};
