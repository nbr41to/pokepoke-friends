'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lightbulb, Send } from 'lucide-react';
import { useState } from 'react';
import { updateGame } from '../action';

export const AnswerInput = () => {
  const [answer, setAnswer] = useState('');

  return (
    <div className="flex gap-x-1">
      <Input
        className="bg-white font-bold"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
          const value = e.currentTarget.value.trim();
          if (value.length !== 5 || !/^[\u30A0-\u30FF]+$/.test(value)) {
            alert('カタカナ5文字で入力してください。');
            return;
          }
          e.preventDefault();
          updateGame(answer);
        }}
      />
      <Button
        size="icon"
        variant="secondary"
        onClick={() => updateGame(answer)}
      >
        <Send className="size-5" />
      </Button>
      <Button size="icon">
        <Lightbulb className="size-5" />
      </Button>
    </div>
  );
};
