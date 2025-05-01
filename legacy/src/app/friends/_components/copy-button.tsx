import { Button } from '@/components/ui/button';
import { FiCopy } from 'react-icons/fi';

export const CopyButton = () => {
  return (
    <Button size="icon" variant="outline">
      <FiCopy className="rotate-180" />
    </Button>
  );
};
