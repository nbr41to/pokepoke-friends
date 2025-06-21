'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  defaultValues: string[];
  currentCardIds: string[];
};

export const ThumbnailSelect = ({ defaultValues, currentCardIds }: Props) => {
  const [open, setOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>(
    defaultValues.length > 0 ? defaultValues : [],
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleOnClick = (cardId: string) => {
    const isIncluded = thumbnails
      .map((id) => id.split('-')[0])
      .includes(cardId);

    if (isIncluded) {
      //   setThumbnails((prev) => prev.filter((id) => id !== cardId));
    } else {
      if (thumbnails.length < 3) {
        setThumbnails([cardId]);
        setOpen(false);
      }
    }
  };

  return (
    <>
      <input type="hidden" name="thumbnail1" value={thumbnails[0]} />
      {/* <input type="hidden" name="thumbnail2" value={thumbnails[1]} />
      <input type="hidden" name="thumbnail3" value={thumbnails[2]} /> */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <Image
          src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${thumbnails[0].replace('#', '_')}.png`}
          alt="Deck Thumbnail"
          width={96}
          height={128}
          className="rounded"
        />
      </button>
      {open && (
        <div
          ref={modalRef}
          className="absolute z-10 flex max-w-80 flex-wrap gap-1 rounded border bg-white p-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          {currentCardIds.map((cardId, index) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={cardId + index}
              className="relative"
              type="button"
              onClick={() => handleOnClick(cardId)}
            >
              <Image
                src={`https://pkhquuguchymresgmtey.supabase.co/storage/v1/object/public/card-images/${cardId.replace('#', '_')}.png`}
                alt={cardId}
                width={96}
                height={128}
              />
              {thumbnails.includes(cardId) && (
                <div className="absolute top-0 right-0 h-full w-full bg-gray-500/50" />
              )}
              <div />
            </button>
          ))}
        </div>
      )}
    </>
  );
};
