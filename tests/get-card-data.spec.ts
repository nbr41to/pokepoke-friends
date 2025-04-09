import fs from 'node:fs';
import { test } from '@playwright/test';
test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/tests/index.html');
  const cardList = page.locator('#PokemonCardList ol li');
  const cardData = await cardList.evaluateAll((elements) => {
    return elements.map((element) => {
      const image = element.querySelector('._thumb img')?.getAttribute('src');
      const body = element.querySelector('._body');
      const name = body?.querySelector('._name a')?.textContent;
      const hp = body?.querySelector('._hp ._v')?.textContent;
      const type = body?.querySelector('._tag ._icon')?.className;
      const context = body?.querySelector('._context ._column-table');
      const abilityName = context?.querySelector('card')?.textContent;
      const abilityText = context
        ?.querySelector('card')
        ?.getAttribute('data-txt');
      const abilityPower = context?.querySelector('_val')?.textContent;

      return {
        image,
        name,
        hp,
        type,
        ability1: {
          name: abilityName,
          text: abilityText,
          power: abilityPower,
        },
      };
    });
  });

  // jsonファイルに保存
  fs.writeFileSync('cardData.json', JSON.stringify(cardData, null, 2));
  // console.log(cardData);
});
