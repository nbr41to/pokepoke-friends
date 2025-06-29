import { Separator } from '@/components/ui/separator';
import prisma from '@/libs/prisma/client';
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import { PlayerSection } from './_components/player-section';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const player = await prisma.player.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="text-xl font-bold">- マイページ -</h1>
      <Separator />
      <h2>アカウント情報</h2>
      <PlayerSection player={player} />
      {/* <Separator /> */}
      {/* <h2>公開設定</h2> */}
    </div>
  );
}
