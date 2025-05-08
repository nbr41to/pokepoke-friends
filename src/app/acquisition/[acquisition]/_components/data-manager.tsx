'use client';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import JA_DATA from '@/constants/data/scraped/gw/gw.json';
import { ACQUISITION_LABEL } from '@/constants/types/acquisition';
import type { Card as OriginCard } from '@/constants/types/card';
import type { Card } from '@/generated/prisma';
import { Database, Filter, Languages } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { mergedData } from '../_utils';
import { insertCards } from '../actions';
import { MergeInserter } from './merge-inserter';

/* 日本語のJSONを統合してDBに流し込む */
type Props = {
  cards: OriginCard[];
  jaCards: typeof JA_DATA;
  dbCards: Card[];
};
export const DataManager = ({ cards, jaCards, dbCards }: Props) => {
  const [hiddenCondition, setHiddenCondition] = useState({
    existDatabase: false,
    byRarity: false,
    nameOnly: false,
    onlyJaData: false,
  });

  const filteredCardAggregates = useMemo(() => {
    const filteredCards = cards.filter((card) => {
      // DBに登録されていないカードのフィルタリング
      const isInDatabase = dbCards.some(
        (dbCard) => dbCard.numbering === card.cardNumber.replace(/\ /g, ''),
      );
      // 日本語のマッチするデータの検索
      const cardPackLabel =
        ACQUISITION_LABEL[
          card.cardNumber.split(' ')[0] as keyof typeof ACQUISITION_LABEL
        ];
      const matchedJaCards = jaCards.filter((jaData) =>
        (jaData.name + jaData.acquisition_pack).startsWith(
          (card.name + cardPackLabel).replace(/ /g, ''),
        ),
      );
      // 更にレアリティがマッチする日本語のカードを探す
      const moreRarityMatched = matchedJaCards.filter(
        (jaData) => jaData.rarity === card.rarity,
      );
      // 名前だけでマッチする日本語のデータを探す
      const nameOnlyMatched = JA_DATA.filter(
        (jaData) => jaData.name === card.name,
      );

      return (
        (hiddenCondition.existDatabase ? !isInDatabase : true) && // DBに登録されていないカードをフィルタリング
        (hiddenCondition.onlyJaData // マッチする日本語のデータが1つのものを表示
          ? (hiddenCondition.byRarity ? moreRarityMatched : matchedJaCards) // Rarityでマッチさせるかどうか
              .length === 1
          : true) &&
        (hiddenCondition.nameOnly
          ? nameOnlyMatched.length > 0 // 名前だけでマッチする日本語のデータを探す
          : true)
      );
    });

    const aggregate = filteredCards.map((card) => {
      // 日本語のマッチするデータの検索
      const cardPackLabel =
        ACQUISITION_LABEL[
          card.cardNumber.split(' ')[0] as keyof typeof ACQUISITION_LABEL
        ];
      const matchedJaCards = jaCards.filter((jaData) =>
        (jaData.name + jaData.acquisition_pack).startsWith(
          (card.name + cardPackLabel).replace(/ /g, ''),
        ),
      );
      // 更にレアリティがマッチする日本語のカードを探す
      const moreRarityMatched = matchedJaCards.filter(
        (jaData) => jaData.rarity === card.rarity,
      );
      // 名前だけでマッチする日本語のデータを探す
      const nameOnlyMatched = JA_DATA.filter(
        (jaData) => jaData.name === card.name,
      );

      return {
        scraped: card,
        matchedCards: hiddenCondition.byRarity
          ? moreRarityMatched
          : hiddenCondition.nameOnly
            ? nameOnlyMatched
            : matchedJaCards,
      };
    });

    return aggregate;
  }, [cards, jaCards, dbCards, hiddenCondition]);

  const handleOnSave = useCallback(async () => {
    await insertCards(
      filteredCardAggregates
        .map((aggregate) => {
          if (aggregate.matchedCards.length === 0) return;
          return mergedData(aggregate.scraped, aggregate.matchedCards[0]);
        })
        .filter((card) => !!card),
    );
  }, [filteredCardAggregates]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Filter size={20} />
          <Toggle
            onClick={() => {
              setHiddenCondition((prev) => ({
                ...prev,
                existDatabase: !prev.existDatabase,
              }));
            }}
            aria-label="DBに登録されているカードを非表示"
            pressed={hiddenCondition.existDatabase}
          >
            <Database />
          </Toggle>
          <Toggle
            onClick={() => {
              setHiddenCondition((prev) => ({
                ...prev,
                byRarity: !prev.byRarity,
              }));
            }}
            aria-label="レアリティでマッチする日本語のデータを表示"
            pressed={hiddenCondition.byRarity}
          >
            Rare
          </Toggle>
          <Toggle
            onClick={() => {
              setHiddenCondition((prev) => ({
                ...prev,
                nameOnly: !prev.nameOnly,
              }));
            }}
            aria-label="名前だけでマッチする日本語のデータを表示"
            pressed={hiddenCondition.nameOnly}
          >
            Name
          </Toggle>
          <Toggle
            onClick={() => {
              setHiddenCondition((prev) => ({
                ...prev,
                onlyJaData: !prev.onlyJaData,
              }));
            }}
            aria-label="マッチする日本語のデータが1つのものを表示"
            pressed={hiddenCondition.onlyJaData}
          >
            <Languages />
          </Toggle>
          <span>
            {filteredCardAggregates.length} / {cards.length} 件
          </span>
        </div>

        <Button
          disabled={filteredCardAggregates.length === 0}
          onClick={handleOnSave}
        >
          表示されているものをDBに保存
        </Button>
      </div>

      <div className="divide-y">
        {filteredCardAggregates.map((aggregate) => (
          <MergeInserter
            key={aggregate.scraped.id}
            card={aggregate.scraped}
            matchedCards={aggregate.matchedCards}
          />
        ))}
      </div>
    </div>
  );
};
