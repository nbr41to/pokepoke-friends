'use client';

import { Button } from '@/components/ui/button';
import type { Player } from '@/generated/prisma';
import { useState } from 'react';
import { PlayerForm } from './form/player-form';

type Props = {
  player: Player | null;
};

export const PlayerSection = ({ player }: Props) => {
  const [editing, setEditing] = useState(false);
  const switchEditing = () => setEditing((prev) => !prev);

  if (!player?.friendId || !player?.playerName)
    return (
      <div className="flex flex-col items-center space-y-4 rounded-md border p-4">
        <p className="text-center text-sm font-bold">
          フレンドIDとプレイヤー名を
          <br />
          登録してください。
        </p>
        <PlayerForm player={player} onClose={() => setEditing(false)} />
      </div>
    );

  return (
    <div className="w-[290px] space-y-2">
      {editing ? (
        <PlayerForm player={player} onClose={switchEditing} />
      ) : (
        <div className="font-hachiMaru space-y-3 rounded-md border p-4">
          <p className="text-sm leading-none">フレンドID: {player?.friendId}</p>
          <p>プレイヤー名: {player?.playerName}</p>
          <p className="text-sm">ひみつのことば: {player?.secretWord}</p>
        </div>
      )}

      <Button
        className="w-full"
        variant={editing ? 'outline' : 'default'}
        onClick={switchEditing}
      >
        {editing ? 'キャンセル' : '編集する'}
      </Button>
    </div>
  );
};
