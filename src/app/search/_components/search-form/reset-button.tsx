import { Button } from '@/components/ui/button';
import { ListX } from 'lucide-react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const ResetButton = () => {
  const { resetQuery } = useSearchQuery();

  return (
    <Button variant="secondary" onClick={resetQuery}>
      <ListX />
      条件をすべてリセットする
    </Button>
  );
};
