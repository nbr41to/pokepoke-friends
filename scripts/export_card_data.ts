import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '../src/generated/prisma';

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

/**
 * Cardテーブルからデータを取得してJSONファイルとして保存する関数
 * @param outputPath 出力ファイルのパス（デフォルト：'./exported_cards.json'）
 */
async function exportCardData(
  outputPath = './src/constants/data/all_cards.json',
) {
  try {
    console.info('カードデータの取得を開始します...');

    // Cardテーブルからすべてのデータを取得
    const cards = await prisma.card.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        // id: true,
        numbering: true,
        cardType: true,
        name: true,
        image: true,
        rarity: true,
        description: true,
        type: true,
        evolveStage: true,
        hp: true,
        move1name: true,
        move1power: true,
        move1energy: true,
        move1description: true,
        move2name: true,
        move2power: true,
        move2energy: true,
        move2description: true,
        abilityName: true,
        abilityDescription: true,
        retreat: true,
        weakness: true,
      },
    });

    console.info(`${cards.length}件のカードデータを取得しました`);

    // JSONとして保存
    const absolutePath = path.resolve(outputPath);
    fs.writeFileSync(absolutePath, JSON.stringify(cards, null, 2), 'utf8');

    console.info(`カードデータを正常に保存しました: ${absolutePath}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    // Prismaクライアントを切断
    await prisma.$disconnect();
  }
}

/**
 * メイン実行関数
 */
async function main() {
  // コマンドライン引数から出力パスを取得（指定がない場合はデフォルト値を使用）
  await exportCardData();
}

// スクリプトが直接実行された場合に実行
if (require.main === module) {
  main().catch((error) => {
    console.error('実行中にエラーが発生しました:', error);
    process.exit(1);
  });
}

// モジュールとしてインポートされた場合に関数をエクスポート
export { exportCardData };
