import fs from 'node:fs';
import path from 'node:path';
import { CARD_TYPE_LIST } from '../src/constants/types/card-types';
import { POKEMON_TYPE_LIST } from '../src/constants/types/pokemon-types';
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
        id: true,
        numbering: true,
        cardType: true,
        name: true,
        image: true,
        rarity: true,
        packName: true,
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

    // 3段階のソートを実行
    // 1. まずidでソート
    let sortedCards = [...cards].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });

    // 2. 次にPOKEMON_TYPEでソート
    sortedCards = sortedCards.sort((a, b) => {
      if (a.type && b.type) {
        const typeIndexA = POKEMON_TYPE_LIST.indexOf(a.type as any);
        const typeIndexB = POKEMON_TYPE_LIST.indexOf(b.type as any);

        if (
          typeIndexA !== -1 &&
          typeIndexB !== -1 &&
          typeIndexA !== typeIndexB
        ) {
          return typeIndexA - typeIndexB;
        }
      } else if (a.type && !b.type) {
        return -1; // typeがあるものを先に
      } else if (!a.type && b.type) {
        return 1; // typeがないものを後に
      }
      return 0; // 変更なし
    });

    // 3. 最後にCARD_TYPEでソート
    sortedCards = sortedCards.sort((a, b) => {
      const cardTypeIndexA = CARD_TYPE_LIST.indexOf(a.cardType as any);
      const cardTypeIndexB = CARD_TYPE_LIST.indexOf(b.cardType as any);

      if (
        cardTypeIndexA !== -1 &&
        cardTypeIndexB !== -1 &&
        cardTypeIndexA !== cardTypeIndexB
      ) {
        return cardTypeIndexA - cardTypeIndexB;
      }
      return 0; // 変更なし
    });

    // JSONとして保存
    const absolutePath = path.resolve(outputPath);
    fs.writeFileSync(
      absolutePath,
      JSON.stringify(sortedCards, null, 2),
      'utf8',
    );

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
