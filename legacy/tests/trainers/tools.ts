import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

interface ToolCard {
  name: string;
  rarity: string;
  effect: string;
  acquisition: string;
  image: string;
  id: string;
}

const extractToolCards = (html: string): ToolCard[] => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const cards: ToolCard[] = [];

  const cardElements = document.querySelectorAll('.w-pkc-data-list-element');
  
  cardElements.forEach((element) => {
    // どうぐカードの場合のみ処理
    const typeElement = element.querySelector('._t-type');
    if (!typeElement || typeElement.textContent !== 'どうぐ') return;

    const name = element.querySelector('._name')?.textContent?.trim() || '';
    
    // レアリティ画像のURLからレアリティを判定
    const rarityImgSrc = element.querySelector('._tag img')?.getAttribute('src') || '';
    let rarity = '';
    if (rarityImgSrc.includes('_ur') || rarityImgSrc.includes('ur.png')) {
      rarity = 'ウルトラレア';
    } else if (rarityImgSrc.includes('_s')) {
      rarity = 'スーパーレア';
    } else if (rarityImgSrc.includes('_a')) {
      rarity = 'レア';
    } else if (rarityImgSrc.includes('_d')) {
      rarity = 'ノーマル';
    }
    
    // カード効果
    const effect = element.querySelector('._column-text')?.textContent?.trim() || '';
    
    // 入手方法
    const acquisition = element.querySelector('._how-to-getting')?.textContent?.replace('入手：', '').trim() || '';
    
    // カード画像URL
    const image = element.querySelector('icard a')?.getAttribute('href') || '';
    
    // カードID
    const id = element.querySelector('icard')?.getAttribute('data-cid') || '';

    cards.push({
      name,
      rarity,
      effect,
      acquisition,
      image,
      id
    });
  });

  return cards;
};

const processHtmlFiles = async () => {
  const cardsDir = path.join(__dirname, '../cards');
  const outputDir = path.join(__dirname, '../../data/trainers');
  const outputFile = path.join(outputDir, 'tools.json');
  const allCards: ToolCard[] = [];

  // data ディレクトリがなければ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(cardsDir).filter(file => file.endsWith('.html'));

  for (const file of files) {
    const filePath = path.join(cardsDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    const cards = extractToolCards(html);
    console.log(`${file}: ${cards.length}枚のどうぐカードを抽出しました`);
    allCards.push(...cards);
  }

  // 重複を排除（同じIDのカードは1つだけ残す）
  const uniqueCards = allCards.filter((card, index, self) => 
    index === self.findIndex((c) => c.id === card.id)
  );

  fs.writeFileSync(outputFile, JSON.stringify(uniqueCards, null, 2));
  console.log(`合計: ${uniqueCards.length}枚のどうぐカードを ${outputFile} に保存しました`);
};

processHtmlFiles();
