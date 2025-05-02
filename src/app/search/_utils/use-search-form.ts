import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  types: z.array(z.string()).optional(),
});
export const useSeatchForm = () => {
  return useForm({
    defaultValues: {
      types: [],
    },
    resolver: zodResolver(schema),
  });
};
