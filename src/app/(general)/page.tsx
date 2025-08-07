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
  A3b: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEWAQAeEhUyBxIQCgFGSjouX1UHGxAADhodAxxQXisPBh8bQxwRHA0uX1UCHRIVMRwEEh1QXisPBh8bQxwRHA0uX1UCHRIVJB0WBQgLRkoPBh8bQ1AJHxcWMBgDHRYcBAAAMgEXFhcYUUkZGh4IXEMbEgQuEA0cCAcKVVUcERwNX1EFCgYWFQAHMBgcBkZKDwYfG0NQFhETGgceCgFGSjouX1UfEwcbLxIeEk1IP1Ljg4Xjgo/jgqXjg5Pjg4Pjgo7jgqPjgoNDLl9VBBcdBw4BFwRNSEZSHA==',
  A4: '/search?query=C0MQEgULJh0ABABRTTQvSFIRHBgSAh0KJBgDFgRNSD8tTVEWAQAeEhUyBxIQCgFGSjouX1UHGxAADhodAxxQXisPBh8bQxwRHA0uX1UCHRIVMRwEEh1QXisPBh8bQxwRHA0uX1UCHRIVJB0WBQgLRkoPBh8bQ1AJHxcWMBgDHRYcBAAAMgEXFhcYUUkZGh4IXEMbEgQuEA0cCAcKVVUcERwNX1EFCgYWFQAHMBgcBkZKDwYfG0NQFhETGgceCgFGSjouX1UfEwcbLxIeEk1IP1LnqJvjgJvmtITjgJnlsaHjgL9GLU1RGBIWBQsCBQBRTU1QGQ==',
  'P-A': '/search?query=C0MDEhQEPAUdBFFJLE0iNj8sPF42TS9IUgoWCgAAAAADQ0lRVRI=',
} as const;

const getLatestData = async () => {
  try {
    const result = await prisma.card.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    if (result.length > 0) return result[0];

    return null;
  } catch (error) {
    return null;
  }
};

export default async function Home() {
  const latestData = await getLatestData();

  return (
    <div>
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
          最終更新:{' '}
          {latestData
            ? new Date(latestData.updatedAt).toLocaleString('ja-JP')
            : '-'}
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
      </div>

      {/* <Separator />
      <div className="font-hachiMaru space-y-8 p-4 text-center">
        <h2 className="font-hachiMaru text-xl">- リリースノート -</h2>
      </div> */}

      <Separator />

      <div className="space-y-8 p-4 text-center">
        <h2 className="font-hachiMaru text-xl">- ログインすると -</h2>

        <ul className="font-hachiMaru">
          <li className="font-bold text-blue-500">
            デッキをつくることができる
          </li>
          <li className="font-bold text-orange-500">プレイヤー検索ができる</li>
          <li className="font-bold text-green-500 line-through">
            掲示板でいろいろできる
          </li>
        </ul>

        <div className="space-y-1">
          <LoginButton />
          <p className="text-xs font-bold">※Google ログインのみ</p>
        </div>
      </div>
    </div>
  );
}
