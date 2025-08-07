'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { POKEMON_TYPE } from '@/constants/types/pokemon-types';
import { Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const typeOptions = [
  {
    id: POKEMON_TYPE.GRASS,
    name: 'くさ',
    image: '/type1.png',
    color: 'bg-green-100',
  },
  {
    id: POKEMON_TYPE.FIRE,
    name: 'ほのお',
    image: '/type2.png',
    color: 'bg-red-100',
  },
  {
    id: POKEMON_TYPE.WATER,
    name: 'みず',
    image: '/type3.png',
    color: 'bg-blue-100',
  },
  {
    id: POKEMON_TYPE.ELECTRIC,
    name: 'でんき',
    image: '/type4.png',
    color: 'bg-yellow-100',
  },
  {
    id: POKEMON_TYPE.PSYCHIC,
    name: 'エスパー',
    image: '/type5.png',
    color: 'bg-purple-100',
  },
  {
    id: POKEMON_TYPE.FIGHTING,
    name: 'かくとう',
    image: '/type6.png',
    color: 'bg-orange-100',
  },
  {
    id: POKEMON_TYPE.DARKNESS,
    name: 'あく',
    image: '/type7.png',
    color: 'bg-slate-300',
  },
  {
    id: POKEMON_TYPE.STEEL,
    name: 'はがね',
    image: '/type8.png',
    color: 'bg-gray-100',
  },
  {
    id: POKEMON_TYPE.DRAGON,
    name: 'ドラゴン',
    image: '/type9.png',
    color: 'bg-indigo-100',
  },
  {
    id: POKEMON_TYPE.NORMAL,
    name: 'ノーマル',
    image: '/type10.png',
    color: 'bg-slate-100',
  },
];

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export const MultiSelectPokemonType = ({ values, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChange = (newValues: string[]) => {
    onChange(newValues);
  };

  const clearSelection = () => {
    onChange([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto min-h-[50px] w-full justify-between bg-transparent p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            {values.length === 0 ? (
              /* Placeholder for no selected types */
              <div className="flex -space-x-3 opacity-70">
                {typeOptions.map((type, index) => (
                  <div
                    key={type.id}
                    className={`rounded-full p-1 ${type.color} border-2 border-white shadow-sm`}
                    style={{ zIndex: 10 - index }}
                  >
                    <Image
                      src={type.image}
                      alt={type.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex -space-x-1">
                  {typeOptions
                    .filter((type) => values.includes(type.id))
                    .slice(0, 5)
                    .map((type, index) => (
                      <div
                        key={type.id}
                        className={`rounded-full p-1 ${type.color} border-2 border-white shadow-sm`}
                        style={{ zIndex: 10 - index }}
                      >
                        <Image
                          src={type.image}
                          alt={type.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                    ))}
                </div>
                {values.length > 5 && (
                  <span className="ml-1 text-xs text-gray-500">
                    +{values.length - 5}
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] p-4"
        align="start"
      >
        <div className="space-y-4">
          <div className="mb-3 flex items-center justify-between">
            {values.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="ml-auto h-6 px-2 text-xs"
              >
                リセット
              </Button>
            )}
          </div>

          <ToggleGroup
            type="multiple"
            value={values}
            onValueChange={handleToggleChange}
            className="mx-auto grid w-fit grid-cols-5 grid-rows-2 gap-2"
          >
            {typeOptions.map((type) => (
              <ToggleGroupItem
                key={type.id}
                value={type.id}
                className={`relative h-12 w-12 cursor-pointer rounded-full border-2 p-0 transition-all duration-200 ${
                  values.includes(type.id)
                    ? 'border-primary scale-105 shadow-lg'
                    : 'border-gray-200 hover:scale-102 hover:border-gray-300'
                } ${type.color}`}
                style={{ borderRadius: '50%' }}
              >
                <Image
                  src={type.image || '/placeholder.svg'}
                  alt={type.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {values.includes(type.id) && (
                  <div className="bg-primary absolute -top-2 -right-2 z-10 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="border-t pt-2">
            <p className="text-xs text-gray-500">
              選択済み: {values.length}個のタイプ
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
