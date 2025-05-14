'use client';

import { Button } from '@/components/ui/button';
import { ArrowBigUpDash } from 'lucide-react';
import { useEffect } from 'react';

export const ScrollTopButton = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // スタにスクロールしたときにボタンを表示
  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector('.scroll-top-button');
      if (button) {
        if (window.scrollY > 300) {
          button.classList.remove('hidden');
          button.classList.add('flex');
        } else {
          button.classList.add('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      size="icon"
      className="scroll-top-button fixed right-4 bottom-4 z-50 hidden size-12 rounded-full border opacity-80"
      onClick={handleScrollTop}
    >
      <ArrowBigUpDash className="size-6" />
    </Button>
  );
};
