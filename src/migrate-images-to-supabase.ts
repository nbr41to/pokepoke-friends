import path from 'node:path';
import prisma from '@/libs/prisma/client';
import { createClient } from '@supabase/supabase-js';

// Supabaseの設定
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const SUPABASE_BUCKET = 'card-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateImages() {
  // 1. 全カード取得
  const cards = await prisma.card.findMany({
    where: {
      image: {
        not: {
          startsWith: SUPABASE_URL,
        },
      },
    },
  });

  for (const card of cards) {
    const imageUrl = card.image;
    if (!imageUrl) continue;

    // すでにSupabaseのURLならスキップ
    if (imageUrl.includes(SUPABASE_URL)) continue;

    try {
      // 2. 画像ダウンロード
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error(`Failed to fetch image for card ${card.id}: ${imageUrl}`);
        continue;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Supabase Storageにアップロード
      const ext = path.extname(imageUrl).split('?')[0] || '.jpg';
      const fileName = `${card.id.replace('#', '_')}${ext}`;
      const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(fileName, buffer, {
          contentType: response.headers.get('content-type') || 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload image for card ${card.id}:`, error);
        continue;
      }

      // 4. 新しいURLを取得
      const publicUrl = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(fileName).data.publicUrl;

      // 5. DBを更新
      await prisma.card.update({
        where: { id: card.id },
        data: { image: publicUrl },
      });

      console.info(`Migrated image for card ${card.id}: ${publicUrl}`);
    } catch (e) {
      console.error(`Error processing card ${card.id}:`, e);
    }
  }
}

migrateImages().then(() => {
  console.info('Migration finished');
  process.exit(0);
});
