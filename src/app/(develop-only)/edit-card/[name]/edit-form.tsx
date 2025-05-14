'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CARD_TYPE_LABEL, CARD_TYPE_LIST } from '@/constants/types/card-types';
import {
  POKEMON_EVOLVE_STAGE_LABEL,
  POKEMON_EVOLVE_STAGE_LIST,
} from '@/constants/types/pokemon-status';
import {
  POKEMON_TYPE_LABEL,
  POKEMON_TYPE_LIST,
} from '@/constants/types/pokemon-types';
import {
  CARD_RARITIES_LABEL,
  CARD_RARITIES_LIST,
} from '@/constants/types/rarities';
import type { Card } from '@/generated/prisma';
import Image from 'next/image';
import { useActionState } from 'react';
import { useTransition } from 'react';
import { Form, FormProvider } from 'react-hook-form';
import { updateCard } from '../_actions';
import { useCustomForm } from '../_utils/useCustomForm';

type Props = {
  card: Card;
};

export const EditForm = ({ card }: Props) => {
  const form = useCustomForm(card);
  const [state, action, pending] = useActionState(updateCard, card);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-x-4">
      <div className="flex-none space-y-1">
        <Image src={card.image} alt={card.name} width={300} height={400} />
        <p className="text-right text-sm">
          {new Date(card.updatedAt).toLocaleString('ja-JP')}
        </p>
      </div>

      <FormProvider {...form}>
        <Form
          control={form.control}
          onSubmit={({ formData }) => {
            startTransition(() => {
              action(formData);
            });
          }}
        >
          <div className="grid w-210 grid-cols-4 items-start gap-3">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>id</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numbering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>numbering</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packName"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>packName</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>cardType</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>カード</SelectLabel>
                          {CARD_TYPE_LIST.map((option) => (
                            <SelectItem key={option} value={option}>
                              {CARD_TYPE_LABEL[option]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>rarity</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>レアリティ</SelectLabel>
                          {CARD_RARITIES_LIST.map((option) => (
                            <SelectItem key={option} value={option}>
                              {CARD_RARITIES_LABEL[option]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="image"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>type</FormLabel>
                  <FormControl>
                    <Select
                      value={value || 'null'}
                      onValueChange={(v) => onChange(v === 'null' ? null : v)}
                      {...field}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>カード</SelectLabel>
                          {POKEMON_TYPE_LIST.map((option) => (
                            <SelectItem key={option} value={option}>
                              {POKEMON_TYPE_LABEL[option]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evolveStage"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>evolveStage</FormLabel>
                  <FormControl>
                    <Select
                      value={value || 'null'}
                      onValueChange={(v) => onChange(v === 'null' ? null : v)}
                      {...field}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>進化</SelectLabel>
                          <SelectItem value="null">-</SelectItem>
                          {POKEMON_EVOLVE_STAGE_LIST.map((option) => (
                            <SelectItem key={option} value={option}>
                              {POKEMON_EVOLVE_STAGE_LABEL[option]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hp"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>hp</FormLabel>
                  <FormControl>
                    <Input type="number" value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1" />
            <FormField
              control={form.control}
              name="move1name"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move1name</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move1power"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move1power</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move1energy"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move1energy</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move1description"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move1description</FormLabel>
                  <FormControl>
                    <Textarea value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move2name"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move2name</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move2power"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move2power</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move2energy"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move2energy</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move2description"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>move2description</FormLabel>
                  <FormControl>
                    <Textarea value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weakness"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>weakness</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retreat"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>retreat</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abilityName"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>abilityName</FormLabel>
                  <FormControl>
                    <Input value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abilityDescription"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>abilityDescription</FormLabel>
                  <FormControl>
                    <Textarea value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field: { value, ...field } }) => (
                <FormItem className="col-span-2">
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea value={value || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex h-full flex-col items-end justify-end">
              {!state && (
                <p className="text-sm text-red-500">変更に失敗しました。</p>
              )}
              <Button size="lg" type="submit" disabled={pending || isPending}>
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
};
