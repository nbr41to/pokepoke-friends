'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  cardId: string;
};

export const CardWithDetailModal = ({ cardId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const startLongPress = () => {
    setIsLongPressing(true);
    longPressTimer.current = setTimeout(() => {
      setIsModalOpen(true);
      setIsLongPressing(false);
    }, 500); // 500ms長押しでモーダル表示
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // モーダル外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Escキーで閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // モーダル開時にページスクロールを無効化
  useEffect(() => {
    if (isModalOpen) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // スクロール位置を復元
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <div
        className={`cursor-pointer transition-transform ${isLongPressing ? 'scale-95' : 'hover:scale-105'}`}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchCancel={cancelLongPress}
      >
        <Image
          src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${cardId.replace('#', '_')}.png`}
          alt={cardId}
          width={96}
          height={128}
          className="rounded"
        />
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white/60">
          <div
            ref={modalRef}
            className="relative max-h-[90vh] max-w-[90vw] p-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                closeModal();
              }
            }}
          >
            <Button
              size="icon"
              className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full"
              aria-label="モーダルを閉じる"
              onClick={closeModal}
            >
              <X className="size-4" />
            </Button>

            <Image
              src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${cardId.replace('#', '_')}.png`}
              alt={cardId}
              width={384}
              height={512}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};
