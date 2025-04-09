import fs from 'node:fs';
import { test } from '@playwright/test';
test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/tests/index.html');
  const cardList = page.locator('.w-pkc-data-list-element');

  const cardData = await cardList.evaluateAll((elements) => {
    return elements.map((element) => {
      const id = element
        .querySelector('._thumb icard')
        ?.getAttribute('data-aid');
      const image = element.querySelector('._thumb img')?.getAttribute('src');
      const body = element.querySelector('._body');
      const name = body?.querySelector('._name a')?.textContent;
      const hp = body?.querySelector('._hp ._v')?.textContent;
      const type = body
        ?.querySelector('._icon')
        ?.className.replace(/_icon _icon- /, '');
      const contexts = body?.querySelectorAll('._context ._column-table');
      const quantityText = contexts?.[0]?.querySelector('.req')?.textContent;
      const quantity = quantityText?.replace('✕', '');
      const costType = contexts?.[0]?.querySelector('.req')?.textContent;

      return {
        id,
        image,
        name,
        hp,
        type,
        ability1: {
          name: contexts?.[0]?.querySelector('card')?.textContent,
          text: contexts?.[0]?.querySelector('card')?.getAttribute('data-txt'),
          power: contexts?.[0]?.querySelector('._val')?.textContent,
          costs: contexts?.[0]?.querySelector('.req')?.textContent,
        },
        ability2: {
          name: contexts?.[1]?.querySelector('card')?.textContent,
          text: contexts?.[1]?.querySelector('card')?.getAttribute('data-txt'),
          power: contexts?.[1]?.querySelector('._val')?.textContent,
        },
      };
    });
  });

  // jsonファイルに保存
  fs.writeFileSync('cardData.json', JSON.stringify(cardData, null, 2));
  // console.log(cardData);
});
