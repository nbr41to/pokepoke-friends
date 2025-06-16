import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import prisma from '@/libs/prisma/client';
import Form from 'next/form';
import { ClipboardCopyButton } from './_components/clipboard-copy-button';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ himitu: string }>;
}) {
  const secretWord = (await searchParams).himitu;
  const players = secretWord
    ? await prisma.player.findMany({
        where: { secretWord },
      })
    : [];

  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="text-xl font-bold">プレイヤー検索</h1>
      <Form action="/players" className="flex items-center gap-2">
        <Input name="himitu" placeholder="ひみつのことば" className="w-64" />
        <Button type="submit">検索</Button>
      </Form>
      <Separator />
      {secretWord && (
        <p className="w-full text-right text-sm">結果: {players.length} 件</p>
      )}

      <div className="w-full max-w-80 space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex w-full items-center justify-between rounded-md border px-3 py-2"
          >
            <div className="space-y-1">
              <p className="text-xs"># {player.friendId}</p>
              <p className="font-bold">{player.playerName}</p>
            </div>
            <ClipboardCopyButton text={player.friendId} />
          </div>
        ))}
      </div>
    </div>
  );
}
