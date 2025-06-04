'use client';

import { Button } from '@/components/ui/button';
import { useSearchQuery } from '@/utils/use-search-query';
import { ListX } from 'lucide-react';

export const ResetButton = () => {
  const { resetQuery } = useSearchQuery();

  return (
    <Button className="h-[42px]" variant="secondary" onClick={resetQuery}>
      <ListX />
      条件をすべてリセットする
    </Button>
  );
};
