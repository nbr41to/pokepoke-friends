'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { type Board, runAction } from './_utils/actions';

export default function Home() {
  const [board, setBoard] = useState<Board>({
    deck: [],
    hands: [],
    used: [],
  });
  const [result, setResult] = useState<number | false>(false);

  const run = () => {
    setBoard({
      deck: [],
      hands: [],
      used: [],
    });
    setResult(false);

    const { board, result } = runAction();

    setBoard(board);
    setResult(result);
  };

  return (
    <div className="p-5">
      <h1 className="font-hachiMaru text-xl py-8 text-center">計算</h1>

      <div className="flex justify-between items-center">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={run}
        >
          run
        </button>
        {/* <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => executeSimulation()}
        >
          executeSimulation
        </button> */}
      </div>

      <div className="flex justify-between items-end">
        <div className="font-bold">山札: {board.deck.length}枚</div>
        <div>
          {result ? (
            <p className="font-bold text-white bg-green-500 rounded p-2 w-fit">
              {result}ターンで成功！！！
            </p>
          ) : (
            <p className="font-bold text-white bg-red-500 rounded p-2 w-fit">
              失敗...
            </p>
          )}
        </div>
      </div>

      <div className="text-center font-bold mt-6">手札</div>
      <ul className="space-y-1 py-2">
        {board.hands.map((card, index) => {
          const basicIndex = board.hands.findIndex(
            (c) => c.type === 'pokemon-basic'
          );
          const evolve1Index = board.hands.findIndex(
            (c) => c.type === 'pokemon-evolve1'
          );
          const evolve2Index = board.hands.findIndex(
            (c) => c.type === 'pokemon-evolve2'
          );

          return (
            <li
              key={index}
              className={cn(
                'flex items-center border-2 rounded p-3 bg-white shadow',
                index === basicIndex && 'border-green-600 bg-green-100',
                index === evolve1Index && 'border-blue-500 bg-blue-100',
                index === evolve2Index && 'border-red-500 bg-red-100'
              )}
            >
              <div className="space-y-1">
                <p className="font-bold">{card.name}</p>
                <p className="text-sm pl-2">{card.effect}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="text-sm">
        <div className="text-center font-bold mt-6">使用したトレーナーズ</div>
        <p className="text-right">
          博士の研究:{' '}
          {board.used.filter((card) => card?.function === 'draw2').length}枚
        </p>
        <p className="text-right">
          モンスターボール:{' '}
          {
            board.used.filter((card) => card?.function === 'search-basic')
              .length
          }
          枚
        </p>
        <p className="text-right">
          ポケモン通信:{' '}
          {board.used.filter((card) => card?.function === 'trade').length}枚
        </p>
      </div>
    </div>
  );
}
