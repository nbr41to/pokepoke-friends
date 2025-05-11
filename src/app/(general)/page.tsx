import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ACQUISITION_LABEL,
  ACQUISITION_LIST,
} from '@/constants/types/acquisition';
import prisma from '@/libs/prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';

const ACQUISITIONS_PATH = {
  A1: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXmna/lvYXjgIrpgIrkvbzlrKNRKkNQDxUYBBwFCwFGSkNRDg==',
  A1a: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXluJTjgJzjgKDjg7vlspdRLltNGQEJFhwBExxQXlJDDg==',
  A2: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXmmK3nqIjjgIrmvrDplrnjgrTjg5Djg5XjgoTjg55GXEPmmLHnqInjgJnmvq/plqrjgrXjgpvjg4zjg5FRW03mmLDnqJ7jgJ7mvqHplqvlhILpga1NL0hSChYKAAAAAANDSVFVEg==',
  A2a: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXot6rlhLnjgIrlhLlDLl9VBBcdBw4BFwRNSEZSHA==',
  A2b: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXjg5jjgpHjg4DjgrvjgpLjg4Pjgrzjg5NNL0hSChYKAAAAAANDSVFVEg==',
  A3: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFXljqPlpZvjgIrlr7jorJbogbbjg47jgpzjg4Pjgp7jg45STVHljr/lpZ7jgIHlr7rorJPogbXjgorjgrnjg5HjgovjgoZQSFLljq3lpZrjgJ3lr7/orJjogbflhJXpgapDLl9VBBcdBw4BFwRNSEZSHA==',
  'P-A':
    '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEbHhsCCxkPBwBVVSkKBQ0fXxkaHggtTVEeGBkXNB8WFgFVVSkKBQ0fXxkaHggtTVESAxsTBxtDSSgZGh4IXA8GHxsyXkYCBAcBEg4GJx8SB1FNAQcIHE1RARYdGxAZBABRTTQvSFIREhAcIRMJFUNJKFU/ICs9Ll4yVTJeRhsECgQYHRYXUltRUQo=',
} as const;

export default async function Home() {
  const latestData = await prisma.card.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return (
    <div className="font-hachiMaru space-y-8 p-4 text-center">
      <h2 className="text-xl">- しゅうろくカードたち -</h2>

      <div className="flex flex-col items-center justify-center gap-y-2">
        {ACQUISITION_LIST.map((acquisition) => (
          <Link
            key={acquisition}
            href={ACQUISITIONS_PATH[acquisition]}
            aria-label={ACQUISITION_LABEL[acquisition]}
            className="font-hachiMaru flex gap-x-3 border-2 border-b-2 border-white px-4 py-2 text-xl transition-colors hover:border-b-gray-600"
          >
            <span>{ACQUISITION_LABEL[acquisition]}</span>
            <Badge className="rounded-full pb-1 text-sm font-bold">
              {acquisition}
            </Badge>
          </Link>
        ))}
      </div>

      <p className="text-xs">
        最終更新: {new Date(latestData?.[0].updatedAt).toLocaleString('ja-JP')}
      </p>

      <Button
        size="lg"
        variant="outline"
        className="rounded-full px-8 font-bold"
        asChild
      >
        <Link href="/search">
          <Search />
          カードをけんさくする
        </Link>
      </Button>

      <Separator />

      <h2 className="text-xl">- ログインしてつかう -</h2>

      <p className="py-8">開発中だよ</p>
    </div>
  );
}
