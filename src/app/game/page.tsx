import { cookies } from 'next/headers';
import { AnswerInput } from './_components/answer-input';
import { MatchResult } from './_components/match-result';
import { StartButton } from './_components/start-button';
import type { GameData } from './type';

export default async function Page() {
  const cookieStore = await cookies();
  const json = cookieStore.get('gameData');
  const gameData = json ? (JSON.parse(json.value) as GameData) : null;

  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="font-hachiMaru relative text-2xl font-bold tracking-widest">
        <span className="text-white">n</span>
        <span className="text-xl">ame</span>
        <span className="mx-1 text-white">g</span>
        <span className="text-xl">ame</span>
        <div className="absolute top-1 -left-[8px] -z-10 size-8 rotate-3 rounded border border-yellow-600 bg-yellow-500" />
        <div className="absolute top-1 left-[71px] -z-10 size-8 -rotate-6 rounded border border-green-600 bg-green-500" />
      </h1>

      {gameData && (gameData.isCorrect || gameData.answers.length > 9) ? (
        <div className="space-y-4 py-4">
          <p className="text-3xl font-bold">
            {gameData.isCorrect ? 'すごーい 🎉' : 'ざんねん 😵'}
          </p>
          <StartButton label="もういっかいあそぶ" />
        </div>
      ) : (
        <div className="h-[168px] rounded-md border p-3">
          <h2 className="text-xl font-bold">ルール</h2>
          <p>
            10回以内に、5文字のポケモンのなまえをあてよう！{' '}
            <br className="hidden md:block" />
            緑: 場所も文字もあってるよ！ 黄: 文字はあってるけど場所がちがうよ！
          </p>
          <p>※「゛」や「゜」は判定に関係ないよ。</p>
        </div>
      )}

      <div className="space-y-3">
        {gameData ? (
          <div className="grid grid-flow-col grid-cols-2 grid-rows-5 gap-2">
            {gameData.answers.map((answer, index) => (
              <MatchResult
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                correctName={gameData.correctName}
                answer={answer}
              />
            ))}
            <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-gray-800 p-4 md:bottom-0">
              <AnswerInput />
            </div>
          </div>
        ) : (
          <StartButton />
        )}
      </div>
    </div>
  );
}
