'use server';

import type { Deck } from '@/constants/types/deck';
import { cookies } from 'next/headers';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const updateDeckMeta = async (_prevState: any, formData: FormData) => {
  const deck = {
    id: formData.get('id') as string,
    thumbnail1: formData.get('thumbnail1') as string,
    thumbnail2: formData.get('thumbnail2') as string,
    thumbnail3: formData.get('thumbnail3') as string,
    name: formData.get('name') as string,
    memo: formData.get('memo') as string,
  };

  const cookieStore = await cookies();
  const decks = cookieStore.get('decks');
  const deckList: Deck[] = decks ? JSON.parse(decks.value) : [];
  const currentDeck = deckList.find((d) => d.id === deck.id);
  if (!currentDeck) {
    return {
      error: 'Deck not found',
      deck,
    };
  }
  deckList[deckList.indexOf(currentDeck)] = { ...currentDeck, ...deck };
  cookieStore.set('decks', JSON.stringify(deckList));
};

export const upsertDeck = async (deck: Deck) => {
  let error = null;
  const cookieStore = await cookies();
  const decks = cookieStore.get('decks');
  const deckList: Deck[] = decks ? JSON.parse(decks.value) : [];
  const existingDeckIndex = deckList.findIndex((d) => d.id === deck.id);

  if (existingDeckIndex !== -1) {
    deckList[existingDeckIndex] = deck; // Update existing deck
  } else if (deckList.length > 9) {
    error = 'You can only have up to 10 decks.';
  } else {
    deckList.push(deck); // Add new deck
  }
  cookieStore.set('decks', JSON.stringify(deckList));

  return {
    error: null,
    decks: deckList,
  };
};

export const deleteDeck = async (deck: Deck) => {
  let error = null;
  const cookieStore = await cookies();
  const decks = cookieStore.get('decks');
  const deckList: Deck[] = decks ? JSON.parse(decks.value) : [];
  const existingDeckIndex = deckList.findIndex((d) => d.id === deck.id);

  if (existingDeckIndex !== -1) {
    deckList[existingDeckIndex] = deck; // Update existing deck
  } else if (deckList.length > 9) {
    error = 'You can only have up to 10 decks.';
  } else {
    deckList.push(deck); // Add new deck
  }
  cookieStore.set('decks', JSON.stringify(deckList));
  return {
    error: null,
    decks: deckList,
  };
};
