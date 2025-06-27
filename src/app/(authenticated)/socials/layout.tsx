import prisma from '@/libs/prisma/client';
import { createClient } from '@/libs/supabase/server';
import Link from 'next/link';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const player = await prisma.player.findUnique({
    where: { id: user?.id },
  });

  if (!user || !player)
    return (
      <div className="font-hachiMaru space-y-4 py-8 text-center">
        <h1 className="text-xl font-bold">アカウント情報が必要です</h1>
        <p>
          この機能を使用するためには、マイページでアカウント情報を登録する必要があります。
        </p>
        <Link href="/setting" className="font-bold underline">
          マイページへ
        </Link>
      </div>
    );

  return <>{children}</>;
}
