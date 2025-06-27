import CARD_DATA from '@/constants/data/all_cards.json';
import { type Card, CardType } from '@/generated/prisma';
import type { GameData } from './type';

/**
 * Cookieに保存する」初期値を生成
 */
export const getDefaultGameData = (
  correctId: string,
  correctName: string,
): GameData => {
  return {
    correctId: correctId,
    correctName: correctName,
    answers: [],
    isCorrect: false,
  };
};

/**
 * PokeAPIからランダムに日本語名が5文字のPokémonの名前を取得する
 */
export const getFiveCharPokemonCards = () => {
  const pokemonCards = (CARD_DATA as Card[]).filter((pokemon) => {
    const name = pokemon.name.replace(' ex', '');
    // カタカナ5文字かチェック
    if (name.length !== 5 || !/^[\u30A0-\u30FF]+$/.test(name)) {
      return false;
    }

    return (
      pokemon.cardType === CardType.pokemon &&
      name.length === 5 &&
      /^[\u30A0-\u30FF]+$/.test(name)
    );
  });
  // 名前が重複しているものを除去
  const uniquePokemonCards = pokemonCards.filter(
    (card, index, self) =>
      index ===
      self.findIndex(
        (c) => c.name.replace(' ex', '') === card.name.replace(' ex', ''),
      ),
  );

  return uniquePokemonCards;
};
export const FIVE_CHAR_POKEMON_NAMES = getFiveCharPokemonCards().map(
  (p) => p.name,
);

/**
 * PokeAPIからランダムに日本語名が5文字のPokémonの名前を取得する
 */
export const getFiveCharRandomPokemon = async () => {
  // TODO: PokeAPIから取得する
  const pokemonCards = getFiveCharPokemonCards();
  const randomIndex = Math.floor(Math.random() * pokemonCards.length);

  return {
    id: pokemonCards[randomIndex].id,
    name: pokemonCards[randomIndex].name.replace(' ex', ''),
  };
};

/**
 * カタカナから濁点と半濁点を除去する
 */
export const normalizeStr = (str: string) =>
  str.normalize('NFD').replace(/[\u3099\u309A]/g, '');
