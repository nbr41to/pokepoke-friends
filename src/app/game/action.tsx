'use server';

import { cookies } from 'next/headers';
import type { GameData } from './type';
import {
  FIVE_CHAR_POKEMON_NAMES,
  getDefaultGameData,
  getFiveCharRandomPokemon,
  normalizeStr,
} from './utils';

export const startNewGame = async () => {
  const correct = await getFiveCharRandomPokemon();

  const cookieStore = await cookies();
  const json = JSON.stringify(getDefaultGameData(correct.id, correct.name));
  cookieStore.set('gameData', json);

  return correct;
};

export const updateGame = async (
  message: string | null,
  formData: FormData,
) => {
  const answer = formData.get('answer') as string | null;
  if (!answer) return '入力がないよ';

  if (answer.length !== 5 || !/^[\u30A0-\u30FF]+$/.test(answer))
    return 'カタカナ5文字で入力してください。';

  if (!FIVE_CHAR_POKEMON_NAMES.includes(answer))
    return 'そのポケモンはいないみたい。';

  const cookieStore = await cookies();
  const json = cookieStore.get('gameData');
  const gameData = json ? (JSON.parse(json.value) as GameData) : null;
  if (!gameData) return 'こわれちゃったみたい';

  const newData = {
    ...gameData,
    answers: [...gameData.answers, answer],
    isCorrect: normalizeStr(gameData.correctName) === normalizeStr(answer),
  };

  cookieStore.set('gameData', JSON.stringify(newData));

  return null;
};
