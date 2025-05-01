'use server';

import fs from 'node:fs';
import currentData from './_data/statistic-data.json';
import { runAction } from './_utils/actions';

export const executeSimulation = async (count = 1000000) => {
  const results = currentData;

  for (let i = 0; i < count; i++) {
    const { result } = runAction();
    if (result === 1) {
      results.first++;
    } else if (result === 2) {
      results.second++;
    } else if (result === 3) {
      results.third++;
    } else {
      results.failed++;
    }
  }

  const total = results.first + results.second + results.third + results.failed;
  const successPercent =
    ((results.first + results.second + results.third) / total) * 100;

  // jsonファイルに保存
  fs.writeFileSync(
    './src/app/calculation/_data/statistic-data.json',
    JSON.stringify(results, null, 2),
  );
  console.info('シミュレーション終了');
  console.info('シミュレーション結果:', `${successPercent.toFixed(2)} %`);
};
