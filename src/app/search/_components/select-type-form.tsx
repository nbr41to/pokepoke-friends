'use client";';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Image from 'next/image';

export const SelectTypeForm = () => {
  return (
    <ToggleGroup type="multiple" onChange={(value) => console.log(value)}>
      {Array.from({ length: 10 }, (_, index) => (
        <ToggleGroupItem
          key={index}
          defaultChecked
          value={`type-${index}`}
          aria-label="Toggle bold"
          className="data-[state=off]:opacity-60 data-[state=off]:grayscale"
        >
          <Image
            src={`/type${index + 1}.png`}
            alt={`Type ${index}`}
            width={20}
            height={20}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
