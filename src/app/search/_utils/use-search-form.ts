import { CARD_TYPE_LIST } from '@/constants/data/card-types';
import { POKEMON_TYPE_LIST } from '@/constants/data/pokemon-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  pokemonTypes: z.array(z.enum(POKEMON_TYPE_LIST)).optional(),
  cardTypes: z.array(z.enum(CARD_TYPE_LIST)).optional(),
});

export const useSeatchForm = () => {
  return useForm({
    defaultValues: {
      pokemonTypes: [...POKEMON_TYPE_LIST],
      cardTypes: [...CARD_TYPE_LIST],
    },
    resolver: zodResolver(schema),
  });
};

export const useSeatchFormContext = () =>
  useFormContext<z.infer<typeof schema>>();
