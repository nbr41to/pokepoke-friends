import { Separator } from '@/components/ui/separator';
import prisma from '@/libs/prisma/client';
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';

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
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="font-hachiMaru text-xl font-bold">マイページ</h1>
      <Separator />
    </div>
  );
}
