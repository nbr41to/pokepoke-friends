'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Gamepad2,
  LogOut,
  LucideGalleryHorizontalEnd,
  Search,
  Settings,
  UserRoundSearch,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from './action';

export function MenuButton({ avatarUrl }: { avatarUrl: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="fixed top-1.5 right-2 rounded-full border p-1 md:relative md:top-auto md:right-auto">
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="font-hachiMaru mr-2">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/search">
            <Search />
            <span className="pb-1">検索</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/players">
            <UserRoundSearch />
            <span className="pb-1">プレイヤー検索</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/decks">
            <LucideGalleryHorizontalEnd className="rotate-180" />
            <span className="pb-1">デッキ構築</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link href="/socials">
            <UsersRound />
            <span className="pb-1">掲示板</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/game">
            <Gamepad2 />
            <span className="pb-1">ミニゲーム</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/setting">
            <Settings />
            <span className="pb-1">マイページ</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut />
          <span className="pb-1">ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
