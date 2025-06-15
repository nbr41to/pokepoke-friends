'use client';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import ALL_CARDS from '@/constants/data/all_cards.json';
import {
  ACQUISITION_LABEL,
  ACQUISITION_LIST,
} from '@/constants/types/acquisition';
import type { Card } from '@/generated/prisma';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const pokemonNames = [
  ...new Set((ALL_CARDS as Card[]).map((card) => card.name)),
].sort();

export function DevCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command
        filter={(value, search, keywords) => {
          // 完全一致
          if (value === search || keywords?.some((k) => k.startsWith(search)))
            return 1;
          // 前方一致
          if (
            value.startsWith(search) ||
            keywords?.some((k) => k.startsWith(search))
          )
            return 0.8;
          // それ以外は表示しない
          return 0;
        }}
      >
        <CommandInput placeholder="Search Cards..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            <CommandItem
              keywords={['カード一括操作']}
              onSelect={() => {
                router.push('/edit/cards');
                setOpen(false);
              }}
            >
              一括操作
            </CommandItem>
            <CommandItem
              keywords={['未登録カード一覧']}
              onSelect={() => {
                router.push('/edit/unregister');
                setOpen(false);
              }}
            >
              未登録カード一覧
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Pack list">
            {ACQUISITION_LIST.map((acquisition) => (
              <CommandItem
                key={acquisition}
                onSelect={() => {
                  router.push(`/acquisition/${acquisition}`);
                  setOpen(false);
                }}
              >
                <span>{ACQUISITION_LABEL[acquisition]}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Cards">
            {pokemonNames.map((name) => (
              <CommandItem
                key={name}
                keywords={[
                  name.replace(/[\u30a1-\u30f6]/g, (match) => {
                    const chr = match.charCodeAt(0) - 0x60;
                    return String.fromCharCode(chr);
                  }),
                ]}
                onSelect={() => {
                  router.push(`/edit/cards/${name}`);
                  setOpen(false);
                }}
              >
                <span>{name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
