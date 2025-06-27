'use client';

import { Button } from '@/components/ui/button';
import { useSearchQuery } from '@/utils/use-search-query';
import { ListX } from 'lucide-react';

export const ResetIconButton = () => {
  const { resetQuery } = useSearchQuery();

  return (
    <Button size="icon" variant="secondary" onClick={resetQuery}>
      <ListX />
    </Button>
  );
};
