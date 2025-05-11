'use client';

import { EnergyIcons } from '@/components/enegy-icons';
import { Button } from '@/components/ui/button';
import type { CARD_DATA } from '@/constants/data/converted';
import type JA_DATA from '@/constants/data/scraped/ja/ja.json';
import type { Card } from '@/generated/prisma';
import { cn } from '@/utils/classnames';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { mergedData } from '../_utils';
import { insertCard } from '../actions';

/* 日本語のJSONを統合してDBに流し込む */
type Props = {
  current: Card | null;
  card: (typeof CARD_DATA)[number];
  matchedCards: typeof JA_DATA;
};
export const MergeInserter = ({ current, card, matchedCards }: Props) => {
  const [selected, setSelected] = useState(matchedCards?.[0]);
  const params = useMemo(() => {
    return mergedData(card, selected);
  }, [card, selected]);

  useEffect(() => {
    setSelected(matchedCards?.[0]);
  }, [matchedCards]);

  const [loading, setLoading] = useState(false);
  const handleOnSave = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const result = await insertCard(params);
    if (result) {
      toast.success(`${result.id} ${result.name}の登録に成功しました`);
    } else {
      toast.error(`${params.id} ${params.name}の登録に失敗しました`);
    }
    setLoading(false);
  }, [params, loading]);

  const handleOnDirectSave = useCallback(
    async (data: (typeof JA_DATA)[number]) => {
      if (loading) return;
      setLoading(true);

      const result = await insertCard(mergedData(card, data));
      if (result) {
        toast.success(`${result.id} ${result.name}の登録に成功しました`);
      } else {
        toast.error(`${data.id} ${data.name}の登録に失敗しました`);
      }
      setLoading(false);
    },
    [card, loading],
  );

  return (
    <div key={card.id} className="flex gap-x-3 py-2">
      <div className="group relative flex-none space-y-1">
        <Image
          src={card.image}
          alt="card"
          width={86}
          height={120}
          style={{ width: 'auto', height: '120px' }}
          unoptimized
        />
        {current && (
          <Image
            className="absolute top-16 right-0 group-hover:opacity-0"
            src={current.image}
            alt="card"
            width={30}
            height={60}
            style={{ width: 'auto', height: '60px' }}
            unoptimized
          />
        )}
        <p className="max-w-21 text-sm font-bold">
          {card.cardNumber}
          <br />
          {card.name}
        </p>
      </div>

      <ChevronRight className="mt-14 size-6" />

      {matchedCards.map((data) => (
        <div
          key={card.id + data.id}
          className="flex flex-col items-center gap-y-2"
        >
          <button
            type="button"
            className={cn(
              'h-fit flex-none cursor-pointer rounded outline-4 outline-offset-2 outline-white/0 focus:outline-red-600',
              selected?.id === data.id ? 'outline-green-600' : '',
            )}
            onClick={() => setSelected(data)}
          >
            <Image
              src={data.image_url}
              alt="card"
              width={86}
              height={120}
              style={{ width: 'auto', height: '120px' }}
              unoptimized
            />
          </button>
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => handleOnDirectSave(data)}
          >
            DBに登録
          </Button>
        </div>
      ))}

      <div className="pl-1">
        <div className="text-sm">
          <p>{selected?.acquisition_pack}</p>
          <p>
            {params.name} {params.type} {params.cardType} {params.rarity}
          </p>
          <p>HP:{params.hp}</p>

          <p className="flex items-center gap-x-1">
            {params.move1energy && (
              <EnergyIcons energies={params.move1energy} />
            )}
            {params.move1name} {params.move1power}
          </p>
          <p className="text-xs">{params.move1description}</p>
          <p className="flex items-center gap-x-1">
            {params.move2energy && (
              <EnergyIcons energies={params.move2energy} />
            )}
            {params.move2name} {params.move2power}
          </p>
          <p className="text-xs">{params.move2description}</p>
          <p>{params.abilityName}</p>
          <p className="text-xs">{params.abilityDescription}</p>

          <p>{selected?.description}</p>
        </div>
      </div>
      <div className="mt-auto ml-auto">
        <Button variant="link" size="lg" asChild>
          <Link
            href={`/acquisition/${params.numbering.split('#')[0]}/${params.numbering.split('#')[1]}`}
          >
            個別で編集
          </Link>
        </Button>

        <Button
          size="lg"
          className="mt-auto ml-auto"
          disabled={!selected || loading}
          onClick={handleOnSave}
        >
          Insert
        </Button>
      </div>
    </div>
  );
};
