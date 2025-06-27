'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lightbulb, Send } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { updateGame } from '../action';

export const AnswerInput = () => {
  const [state, action, pending] = useActionState(updateGame, null);

  useEffect(() => {
    if (state) {
      alert(state);
    }
  }, [state]);

  return (
    <form className="flex gap-x-2" action={action}>
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
