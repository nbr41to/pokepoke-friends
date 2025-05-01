import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

interface Card {
  id: string;
  image: string;
  hp: string;
  type: string;
  ability1: {
    name: string;
    text: string;
    power: string;
  };
}

const processHtmlFile = (filePath: string): Card[] => {
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  return Array.from(document.querySelectorAll('.w-pkc-data-list-element')).map(
    (element: Element) => {
      const id = element.querySelector('icard')?.getAttribute('data-aid') || '';
      const image = element.querySelector('img')?.getAttribute('src') || '';
      const hp = element.querySelector('._hp ._v')?.textContent || '';
      const type = element.querySelector('._icon')?.className || '';

      const abilityElement = element.querySelector('._column-table');
      const ability1 = {
        name: abilityElement?.querySelector('._name card')?.textContent || '',
        text:
          abilityElement
            ?.querySelector('._name card')
            ?.getAttribute('data-txt') || '',
        power: abilityElement?.querySelector('._val')?.textContent || '',
      };

      return {
        id,
        image,
        hp,
        type,
        ability1,
      };
    }
  );
};

const cardsDir = path.join(__dirname, 'cards');
const outputPath = path.join(__dirname, '..', 'data', 'pokemon.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const allCards: Card[] = [];

fs.readdirSync(cardsDir).forEach((file) => {
  if (file.endsWith('.html')) {
    const inputPath = path.join(cardsDir, file);
    const cards = processHtmlFile(inputPath);
    allCards.push(...cards);
    console.log(`Processed ${file}`);
  }
});

fs.writeFileSync(outputPath, JSON.stringify(allCards, null, 2));
console.log(`Saved all cards to ${path.basename(outputPath)}`);
