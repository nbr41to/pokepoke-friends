'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { signOut } from './action';

export function MenuButton({ avatarUrl }: { avatarUrl: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1">
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>検索</DropdownMenuItem>
        <DropdownMenuItem>デッキ構築</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>ログアウト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
