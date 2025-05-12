'use client';

import type { Card } from '@/generated/prisma';
import { useEffect, useRef, useState } from 'react';
import { CardListItem } from './card-list-item';

type Props = {
  cards: Card[];
};
export const CardList = ({ cards }: Props) => {
  return (
    <div className="divide-y divide-blue-300">
      {cards.map((card) => (
        <LazyCardListItem key={card.numbering} card={card} />
      ))}
    </div>
  );
};

type LazyCardListItemProps = {
  card: Card;
};

const LazyCardListItem = ({ card }: LazyCardListItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '240px', // 画面外240pxの位置からロードを開始
        threshold: 0.1,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-[102px]" ref={ref}>
      {isVisible ? <CardListItem card={card} /> : <></>}
    </div>
  );
};
