'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const deleteDeck = async (id: string) => {
  const cookieStore = await cookies();
  const decks = JSON.parse(cookieStore.get('decks')?.value || '[]');
  const updatedDecks = decks.filter((deck: { id: string }) => deck.id !== id);

  cookieStore.set('decks', JSON.stringify(updatedDecks));

  redirect('/decks');
};
