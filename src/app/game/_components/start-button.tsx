'use client';

import { Button } from '@/components/ui/button';
import { startNewGame } from '../action';

export const StartButton = ({ label = 'はじめる' }) => {
  //   const [state, action] = useActionState();

  return (
    <Button className="font-hachiMaru" onClick={startNewGame}>
      {label}
    </Button>
  );
};
