import { createClient } from '@/libs/supabase/server';
import {
  GalleryHorizontalEnd,
  Gamepad2,
  Search,
  Settings,
  UsersRound,
} from 'lucide-react';

import Link from 'next/link';
import PokeBall from '../icons/PokeBall';
import { Button } from '../ui/button';
import { LoginButton } from './login-button';
import { MenuButton } from './menu-button';

export const Header = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

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
        {isLoggedIn && (
          <>
            <Button variant="link" className="text-lg" asChild>
              <Link href="/decks">
                <GalleryHorizontalEnd className="mt-1 rotate-180" />
                デッキ構築
              </Link>
            </Button>
            <Button disabled variant="link" className="text-lg">
              {/* <Link href="/socials"> */}
              <UsersRound className="mt-1" />
              掲示板
              {/* </Link> */}
            </Button>
            <Button variant="link" className="text-lg" asChild>
              <Link href="/game">
                <Gamepad2 className="mt-1" />
                ミニゲーム
              </Link>
            </Button>
            <Button variant="link" className="text-lg" asChild>
              <Link href="/setting">
                <Settings className="mt-1" />
                マイページ
              </Link>
            </Button>
          </>
        )}
      </div>
      {isLoggedIn ? (
        <MenuButton avatarUrl={user.user_metadata.avatar_url} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
};
