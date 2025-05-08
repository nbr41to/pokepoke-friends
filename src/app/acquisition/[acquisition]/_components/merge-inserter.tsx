'use client';

import { Button } from '@/components/ui/button';
import type JA_DATA from '@/constants/data/scraped/gw/gw.json';
import type { Card as OriginCard } from '@/constants/types/card';
import { cn } from '@/utils/classnames';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { mergedData } from '../_utils';
import { insertCard } from '../actions';

/* 日本語のJSONを統合してDBに流し込む */
type Props = {
  card: OriginCard;
  matchedCards: typeof JA_DATA;
};
export const MergeInserter = ({ card, matchedCards }: Props) => {
  const [selected, setSelected] = useState(matchedCards?.[0]);
  const params = useMemo(() => {
    return mergedData(card, selected);
  }, [card, selected]);

  return (
    <div key={card.id} className="py-2">
      <p className="text-sm">
        {card.cardNumber} {card.name}
      </p>

      <div className="flex gap-x-2">
        <Image
          src={card.image}
          alt="card"
          width={120}
          height={120}
          style={{ width: 'auto', height: '120px' }}
        />

        {matchedCards.map((data) => (
          <button
            type="button"
            key={data.id}
            className={cn(
              'flex-none rounded outline-4 outline-offset-2 outline-white/0 focus:outline-red-600',
              selected?.id === data.id ? 'outline-green-600' : '',
            )}
            onClick={() => setSelected(data)}
          >
            <Image
              src={data.image_url}
              alt="card"
              width={120}
              height={120}
              style={{ width: 'auto', height: '120px' }}
            />
          </button>
        ))}
        <div>
          <p className="text-sm">
            {params.name} {params.type} {params.cardType} HP:{params.hp}{' '}
            {params.rarity}
          </p>
          <p className="text-sm">{selected?.description}</p>
          <p className="text-sm">{selected?.move1_name}</p>
          <p className="text-xs">{selected?.move1_description}</p>
          <p className="text-sm">{selected?.move2_name}</p>
          <p className="text-xs">{selected?.move2_description}</p>

          <Button
            className="focus:bg-green-600"
            disabled={!selected}
            onClick={() => insertCard(params)}
          >
            追加
          </Button>
        </div>
      </div>
    </div>
  );
};
