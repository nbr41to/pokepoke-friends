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
import { LoginButton } from './_components/login-button';

const ACQUISITIONS_PATH = {
  A1: '/search?query=C0MDEhQEPAUdBFFJLE3mnbLlvZPjgJ7pgJvkva7lrKNVMl5GGwQKBBgdFhdSW1FRCg==',
  A1a: '/search?query=C0MDEhQEPAUdBFFJLE3luInjgIrjgLTjg6rlsoVRKkNQDxUYBBwFCwFGSkNRDg==',
  A2: '/search?query=C0MDEhQEPAUdBFFJLE3mmLDnqJ7jgJ7mvqHplqtRKkNQDxUYBBwFCwFGSkNRDg==',
  A2a: '/search?query=C0MDEhQEPAUdBFFJLE3ot7flhK/jgJ7lhKhRLltNGQEJFhwBExxQXlJDDg==',
  A2b: '/search?query=C0MDEhQEPAUdBFFJLE3jg4Xjgofjg5TjgqrjgoDjg4Pjgrjjg4tQOVxDGBYOGB0WFBJRSVVNDw==',
  A3: '/search?query=C0MDEhQEPAUdBFFJLE3ljr7lpY3jgJ7lr6norITogbZVMl5GGwQKBBgdFhdSW1FRCg==',
  A3a: '/search?query=C0MDEhQEPAUdBFFJLE3nlILmrYXlhLPjg47jgprjg5fjg4Djg5ZQOVxDGBYOGB0WFBJRSVVNDw==',
  'P-A': '/search?query=C0MDEhQEPAUdBFFJLE0iNj8sPF42TS9IUgoWCgAAAAADQ0lRVRI=',
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

      <LoginButton />

      <p className="py-8">開発中だよ</p>
    </div>
  );
}
