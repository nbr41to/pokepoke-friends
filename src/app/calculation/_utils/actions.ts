import { cards, other } from '../_data/card';

type Card = {
  name: string;
  type: string;
  effect: string | null;
  function: string | null;
};
export type Board = {
  deck: Card[];
  hands: Card[];
  used: Card[];
};

/**
 * カードをシャッフルする関数
 */
const shuffleDeck = (deck: Card[]) => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

/**
 * 条件を達成しているかどうかをチェックする関数
 */
const checkCondition = (board: Board) => {
  const condition1 = board.hands.some((card) => card.type === 'pokemon-basic');
  const condition2 = board.hands.some(
    (card) => card.type === 'pokemon-evolve1',
  );
  const condition3 = board.hands.some(
    (card) => card.type === 'pokemon-evolve2',
  );

  return condition1 && condition2 && condition3;
};

/**
 * 最初の5枚にたねポケモンが含まれるまでシャッフルする関数
 */
const setupDeck = (board: Board) => {
  const size = 5; // 手札のサイズ
  let shuffledDeck = [...board.deck];
  let hasBasicPokemon = false;

  // deckの枚数が20枚になるまで効果のないカードを追加
  while (shuffledDeck.length < 20) {
    shuffledDeck.push(other);
  }

  // デッキをシャッフルして、最初の5枚にたねポケモンが含まれるまで繰り返す
  do {
    shuffledDeck = shuffleDeck(shuffledDeck);
    hasBasicPokemon = shuffledDeck
      .slice(0, size)
      .some((card) => card.type === 'pokemon-basic');
  } while (!hasBasicPokemon);

  return {
    ...board,
    deck: shuffledDeck,
  };
};

/**
 * カードを引く関数
 */
const drawCards = (board: Board, count = 1) => {
  const newDeck = [...board.deck];
  const newHands = [...board.hands];
  newHands.push(...newDeck.splice(0, count));

  return {
    ...board,
    deck: newDeck,
    hands: newHands,
  };
};

/**
 * カードを捨てる関数
 */
const discardCard = (board: Board, index: number) => {
  return {
    ...board,
    hands: board.hands.filter((_, i) => i !== index),
    used: [...board.used, board.hands[index]],
  };
};

/**
 * モンスターボールを使用してたねポケモンを引く関数
 */
const searchBasePokemon = (board: Board) => {
  let newDeck = [...board.deck];
  let newHands = [...board.hands];

  const baseIndex = newDeck.findIndex((card) => card.type === 'pokemon-basic');
  if (baseIndex !== -1) {
    const basePokemon = newDeck.splice(baseIndex, 1)[0];
    newHands = [...newHands, basePokemon];
    newDeck = shuffleDeck(newDeck);
  }

  return {
    ...board,
    deck: newDeck,
    hands: newHands,
  };
};

/**
 * 博士の研究とモンスターボールを使用して、手札を更新する関数
 */
const updateHands = (board: Board) => {
  let newBoard = { ...board };
  /* モンスターボールを引いていれば使用する */
  if (board.hands.map((card) => card.function).includes('search-basic')) {
    console.info('◯「モンスターボール」を使用');
    newBoard = searchBasePokemon(newBoard);
    newBoard = discardCard(
      newBoard,
      newBoard.hands.findIndex((card) => card.function === 'search-basic'),
    );
  }
  /* 博士の研究があれば使用する */
  if (newBoard.hands.map((card) => card.function).includes('draw2')) {
    console.info('◎「博士の研究」を使用');
    newBoard = searchBasePokemon(newBoard);
    newBoard = discardCard(
      newBoard,
      newBoard.hands.findIndex((card) => card.function === 'draw2'),
    );
  }
  /* モンスターボールを引いていれば使用する */
  if (newBoard.hands.map((card) => card.function).includes('search-basic')) {
    console.info('◯「モンスターボール」を使用');
    newBoard = searchBasePokemon(newBoard);
    newBoard = discardCard(
      newBoard,
      newBoard.hands.findIndex((card) => card.function === 'search-basic'),
    );
  }

  return newBoard;
};

/**
 * ポケモン通信を使用してポケモンを入れ替える関数
 */
const tradePokemon = (board: Board) => {
  let newDeck = [...board.deck];
  let newHands = [...board.hands];
  const cardIndex = newDeck.findIndex((c) => c.type.startsWith('pokemon-'));
  if (cardIndex !== -1) {
    const tradedCard = newDeck.splice(cardIndex, 1)[0];
    newHands = [...newHands, tradedCard];
    newDeck = shuffleDeck(newDeck);
  }
  return {
    ...board,
    deck: newDeck,
    hands: newHands,
  };
};

export const runAction = (): { board: Board; result: number | false } => {
  console.info('++++++++ ++++++++++ ++++++++');
  console.info('++++++++ RUN ACTION ++++++++');
  console.info('++++++++ ++++++++++ ++++++++');

  let board: Board = {
    deck: cards,
    hands: [],
    used: [],
  };

  /* 最初 */
  console.info('++++++++ GAME START ++++++++');
  board = setupDeck(board);
  board = drawCards(board, 5);

  console.info('++++++++ YOUR TURN 1 ++++++++');
  /* 1枚ドロー */
  board = drawCards(board);

  /**
   * 必要な手札の更新
   * 1. モンスターボールがあればすべて使用する
   * 2. 博士の研究があれば使用する
   * 3. モンスターボールを引いていれば使用する
   */
  board = updateHands(board);

  /* 進化系統が揃っているかチェック */
  if (checkCondition(board)) {
    console.info('★ 進化系統が揃った！ (1)');
    return {
      board,
      result: 1,
    };
  }

  console.info('++++++++ YOUR TURN 2 ++++++++');
  /* 1枚ドロー */
  board = drawCards(board);

  /**
   * 必要な手札の更新
   * 1. モンスターボールがあればすべて使用する
   * 2. 博士の研究があれば使用する
   * 3. モンスターボールを引いていれば使用する
   */
  board = updateHands(board);

  /* pokemon-evolve1がなくて、ポケモン通信を持っている場合に1枚使用する */
  if (
    !board.hands.map((card) => card.type).includes('pokemon-evolve1') &&
    board.hands.map((card) => card.function).includes('trade')
  ) {
    console.info('◯「ポケモン通信」を使用');
    board = tradePokemon(board);
    board = discardCard(
      board,
      board.hands.findIndex((card) => card.function === 'trade'),
    );
  }

  /* pokemon-evolve1がなければ、終了 */
  if (!board.hands.map((card) => card.type).includes('pokemon-evolve1')) {
    return {
      board,
      result: false,
    };
  }

  /* 進化系統が揃っているかチェック */
  if (checkCondition(board)) {
    console.info('★ 進化系統が揃った！ (2)');
    return {
      board,
      result: 2,
    };
  }

  console.info('++++++++ YOUR TURN 3 ++++++++');
  /* 1枚ドロー */
  board = drawCards(board);

  /**
   * 必要な手札の更新
   * 1. モンスターボールがあればすべて使用する
   * 2. 博士の研究があれば使用する
   * 3. モンスターボールを引いていれば使用する
   */
  board = updateHands(board);

  /* pokemon-evolve2がなくて、ポケモン通信を持っている場合に1枚使用する */
  if (
    !board.hands.map((card) => card.type).includes('pokemon-evolve2') &&
    board.hands.map((card) => card.function).includes('trade')
  ) {
    console.info('◯「ポケモン通信」を使用');
    board = tradePokemon(board);
    board = discardCard(
      board,
      board.hands.findIndex((card) => card.function === 'trade'),
    );
  }

  /* pokemon-evolve2がなければ、終了 */
  if (!board.hands.map((card) => card.type).includes('pokemon-evolve2')) {
    return {
      board,
      result: false,
    };
  }

  /* 進化系統が揃っているかチェック */
  if (checkCondition(board)) {
    console.info('★ 進化系統が揃った！ (3)');
    return {
      board,
      result: 3,
    };
  }

  return {
    board,
    result: false,
  };
};
