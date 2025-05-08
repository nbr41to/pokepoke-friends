'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/classnames';

type OptionType = {
  value: string;
  label: string;
  kana?: string;
  romaji?: string;
};

interface Props {
  options: OptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  maxHeight?: number;
}

export function MultiCombobox({
  options,
  value,
  onChange,
  placeholder = 'アイテムを選択...',
  emptyMessage = '該当する項目がありません',
  maxHeight = 300,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [filterKey, setFilterKey] = React.useState(0);

  // Focus input when dropdown opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Update filter key when input changes to force re-render
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    setFilterKey((prev) => prev + 1);
  }, [inputValue]);

  const handleSelect = React.useCallback(
    (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter((item) => item !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    },
    [value, onChange],
  );

  const handleRemove = React.useCallback(
    (optionValue: string) => {
      onChange(value.filter((item) => item !== optionValue));
    },
    [value, onChange],
  );

  const handleClearAll = React.useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Calculate filtered options based on input value
  const filteredOptions = React.useMemo(() => {
    const searchTerm = inputValue.toLowerCase().trim();
    if (!searchTerm) return options;

    return options.filter((option) => {
      return (
        option.label.toLowerCase().includes(searchTerm) ||
        (option.kana || '').toLowerCase().includes(searchTerm) ||
        (option.romaji || '').toLowerCase().includes(searchTerm)
      );
    });
  }, [options, inputValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="hover:bg-background h-auto min-h-[42px] w-full justify-between py-2"
        >
          <div className="flex flex-wrap items-center gap-1">
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((val) => {
                  const option = options.find((option) => option.value === val);
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                    >
                      {option?.label || val}
                      <span
                        // biome-ignore lint/a11y/useSemanticElements: <explanation>
                        role="button"
                        tabIndex={0}
                        className="ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(val);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemove(val);
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">削除</span>
                      </span>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
          <div className="ml-2 flex shrink-0 items-center">
            {value.length > 0 && (
              <span
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role="button"
                tabIndex={0}
                className="hover:bg-muted mr-1 cursor-pointer rounded-full p-1 outline-none focus:ring-2 focus:ring-offset-1"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearAll();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClearAll();
                  }
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">すべてクリア</span>
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="検索..."
            value={inputValue}
            onValueChange={setInputValue}
            autoFocus={true}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup
              key={`group-${filterKey}`}
              className={cn(
                'overflow-auto',
                maxHeight ? `max-h-[${maxHeight}px]` : '',
              )}
            >
              {filteredOptions.map((option) => (
                <CommandItem
                  key={`${option.value}-${filterKey}`}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
