'use server';

import { cookies } from 'next/headers';
import type { GameData } from './type';
import { getDefaultGameData, getRandomPokemon, normalizeStr } from './utils';

export const startNewGame = async () => {
  const correct = await getRandomPokemon();

  const cookieStore = await cookies();
  const json = JSON.stringify(getDefaultGameData(correct.id, correct.name));
  cookieStore.set('gameData', json);

  return correct;
};

export const updateGame = async (answer: string) => {
  if (answer.length !== 5) return;

  const cookieStore = await cookies();
  const json = cookieStore.get('gameData');
  const gameData = json ? (JSON.parse(json.value) as GameData) : null;
  if (!gameData) return;

  const newData = {
    ...gameData,
    answers: [...gameData.answers, answer],
    isCorrect: normalizeStr(gameData.correctName) === normalizeStr(answer),
  };

  cookieStore.set('gameData', JSON.stringify(newData));
};
