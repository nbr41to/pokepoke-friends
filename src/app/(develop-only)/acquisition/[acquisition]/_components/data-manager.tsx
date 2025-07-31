'use client';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { CARD_DATA } from '@/constants/data/converted';
import JA_DATA from '@/constants/data/scraped/ja/ja.json';
import { ACQUISITION_LABEL } from '@/constants/types/acquisition';
import type { Card } from '@/generated/prisma';
import { cn } from '@/utils/classnames';
import { Database, Eye, Filter, Search, SearchCheckIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { mergedData } from '../_utils';
import { upsertCards } from '../actions';
import { MergeInserter } from './merge-inserter';

/* 日本語のJSONを統合してDBに流し込む */
type Props = {
  cards: typeof CARD_DATA;
  jaCards: typeof JA_DATA;
  dbCards: Card[];
};
export const DataManager = ({ cards, jaCards, dbCards }: Props) => {
  const [condition, setCondition] = useState({
    hiddenExistDatabase: false,
    hiddenMultiMatch: true,
    matchCondition: 'rarity', // 'rarity & name & same pack' | 'name & same pack' | 'name'
  });

  const filteredCardAggregates = useMemo(() => {
    const aggregate = cards
      .map((card) => {
        // 日本語のマッチするデータの検索
        const cardPackLabel =
          ACQUISITION_LABEL[
            card.cardNumber.split(' ')[0] as keyof typeof ACQUISITION_LABEL
          ];
        const matchedJaCards = jaCards.filter((jaData) => {
          const translateName = jaData.name.startsWith('アンノーン') // アンノーン*の場合に語尾の「*」を除去 （例: 「アンノーンG」→「アンノーン」）
            ? 'アンノーン'
            : jaData.name;

          return (translateName + jaData.acquisition_pack).startsWith(
            (card.name + cardPackLabel).replace(/ /g, ''),
          );
        });
        // 更にレアリティがマッチする日本語のカードを探す
        const moreRarityMatched = matchedJaCards.filter(
          (jaData) => jaData.rarity === card.rarity,
        );
        // 名前だけでマッチする日本語のデータを探す
        const nameOnlyMatched = JA_DATA.filter((jaData) => {
          const translateName = jaData.name.startsWith('アンノーン') // アンノーン*の場合に語尾の「*」を除去 （例: 「アンノーンG」→「アンノーン」）
            ? 'アンノーン'
            : jaData.name;
          return (
            translateName === card.name.replace(/ /g, '').replace(/・/g, '')
          );
        });

        // 現在のDBに保存されているカード
        const currentSaved =
          dbCards.find(
            (dbCard) => dbCard.numbering === card.cardNumber.replace(/\ /g, ''),
          ) || null;

        return {
          scraped: card,
          matchedCards:
            condition.matchCondition === 'rarity'
              ? moreRarityMatched
              : condition.matchCondition === 'pack'
                ? matchedJaCards
                : nameOnlyMatched,
          current: currentSaved,
        };
      })
      .filter((card) => {
        const isSingleMatch = card.matchedCards.length === 1;

        return (
          (condition.hiddenExistDatabase ? !card.current : true) &&
          (condition.hiddenMultiMatch ? isSingleMatch : true)
        );
      });

    return aggregate;
  }, [cards, jaCards, dbCards, condition]);

  const [loading, setLoading] = useState(false);
  const handleOnSave = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const result = await upsertCards(
      filteredCardAggregates
        .map((aggregate) => {
          if (aggregate.matchedCards.length === 0) return;
          return mergedData(aggregate.scraped, aggregate.matchedCards[0]);
        })
        .filter((card) => !!card),
    );
    if (result) {
      toast.success('一括データの登録に成功しました');
    } else {
      toast.error('一括データの登録に失敗しました');
    }
    setLoading(false);
  }, [filteredCardAggregates, loading]);

  return (
    <div>
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b p-2 backdrop-blur-md">
        <div className="flex items-center gap-x-3">
          <Filter size={20} />
          <Toggle
            className="border"
            onClick={() => {
              setCondition((prev) => ({
                ...prev,
                hiddenExistDatabase: !prev.hiddenExistDatabase,
              }));
            }}
            pressed={condition.hiddenExistDatabase}
          >
            <Database />
          </Toggle>
          <Toggle
            className="border"
            onClick={() => {
              setCondition((prev) => ({
                ...prev,
                hiddenMultiMatch: !prev.hiddenMultiMatch,
              }));
            }}
            pressed={condition.hiddenMultiMatch}
          >
            <SearchCheckIcon />
          </Toggle>
          <ToggleGroup
            className="border"
            type="single"
            value={condition.matchCondition}
            onValueChange={(value) =>
              setCondition((prev) => ({
                ...prev,
                matchCondition: value,
              }))
            }
          >
            <ToggleGroupItem value="rarity">Rare</ToggleGroupItem>
            <ToggleGroupItem value="pack">Pack</ToggleGroupItem>
            <ToggleGroupItem value="name">Name</ToggleGroupItem>
          </ToggleGroup>

          <span className="flex items-center gap-x-1">
            <Eye size={20} />
            {filteredCardAggregates.length} / {cards.length} 件
          </span>

          <span className="flex items-center gap-x-1">
            <Search size={20} />
            <span
              className={cn(
                filteredCardAggregates.map(
                  (aggregate) => aggregate.matchedCards.length > 0,
                ).length !== filteredCardAggregates.length &&
                  'font-bold text-red-500',
              )}
            >
              {
                filteredCardAggregates.map(
                  (aggregate) => aggregate.matchedCards.length > 0,
                ).length
              }
            </span>{' '}
            / {filteredCardAggregates.length} 件
          </span>
        </div>

        <Button
          disabled={filteredCardAggregates.length === 0 || loading}
          onClick={handleOnSave}
        >
          DBに保存 / 上書き
        </Button>
      </div>

      <div className="divide-y">
        {filteredCardAggregates.map((aggregate) => (
          <MergeInserter
            key={aggregate.scraped.id}
            current={aggregate.current}
            card={aggregate.scraped}
            matchedCards={aggregate.matchedCards}
          />
        ))}
      </div>
    </div>
  );
};
