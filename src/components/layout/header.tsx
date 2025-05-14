import { GalleryHorizontalEnd, LogIn, Search, UsersRound } from 'lucide-react';
import Link from 'next/link';
import PokeBall from '../icons/PokeBall';
import { Button } from '../ui/button';

export const Header = () => {
  return (
    <header className="font-hachiMaru flex items-center justify-center border-b px-6 py-3 md:justify-between">
      <Link href="/" className="flex items-center gap-x-3">
        <PokeBall size={20} className="mt-1" />
        <h1 className="text-xl font-bold">ぽけぽけふれんず。</h1>
      </Link>
      <div className="hidden md:block">
        <Button variant="link" asChild className="text-lg">
          <Link href="/search">
            <Search className="mt-1" />
            カード検索
          </Link>
        </Button>
        <Button disabled variant="link" className="text-lg">
          <UsersRound className="mt-1" />
          掲示板
        </Button>
        <Button disabled variant="link" className="text-lg">
          <GalleryHorizontalEnd className="mt-1 rotate-180" />
          デッキ構築
        </Button>
      </div>
      <Button disabled className="hidden pt-1 font-bold md:flex">
        <LogIn className="mt-1" />
        ログイン
      </Button>
    </header>
  );
};
