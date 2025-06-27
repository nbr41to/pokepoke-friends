'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lightbulb, Send } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { updateGame } from '../action';
import { FIVE_CHAR_POKEMON_NAMES } from '../utils';

export const AnswerInput = () => {
  const [state, action, pending] = useActionState(updateGame, null);

  useEffect(() => {
    if (state) {
      alert(state);
    }
  }, [state]);

  const getValidateError = (answer: string): string | null => {
    if (!answer) return '回答を入力してください。';
    if (answer.length !== 5) return 'カタカナ5文字で入力してください。';
    if (!/^[\u30A0-\u30FF]+$/.test(answer))
      return 'カタカナで入力してください。';
    if (!FIVE_CHAR_POKEMON_NAMES.includes(answer))
      return 'そのポケモンはいないみたい。';
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer') as string | null;

    const errorMessage = answer ? getValidateError(answer) : null;
    if (errorMessage) {
      e.preventDefault();
      alert(errorMessage);
      return;
    }
  };

  return (
    <form className="flex gap-x-2" action={action} onSubmit={handleSubmit}>
      <Input
        placeholder="ポケモンのなまえ"
        className="bg-white font-bold"
        name="answer"
      />
      <Button type="submit" size="icon" variant="default">
        <Send className="size-5" />
      </Button>
      <Button size="icon" type="button" variant="outline" hidden>
        <Lightbulb className="size-5" />
      </Button>
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="size-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
        </div>
      )}
    </form>
  );
};
