'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MinusCircle, PlusCircle } from 'lucide-react';

type Props = {
  options: number[];
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  renge?: number;
};
export const CounterForm = ({
  options,
  value,
  onValueChange,
  label,
  renge = 10,
}: Props) => {
  const handleOnValueChange = (newValue: string) => {
    const parsedValue = Number.parseInt(newValue, 10);
    if (!Number.isNaN(parsedValue)) {
      onValueChange(parsedValue);
    }
  };
  const handleIncrement = () => {
    const maxCount = Math.max(...options);
    if (value < maxCount) {
      onValueChange(value + renge);
    }
  };
  const handleDecrement = () => {
    const minCount = Math.min(...options);
    if (value > minCount) {
      onValueChange(value - renge);
    }
  };

  return (
    <div className="flex gap-x-1">
      <Button size="icon" variant="ghost" onClick={handleDecrement}>
        <MinusCircle className="size-5" />
      </Button>
      <Select value={value.toString()} onValueChange={handleOnValueChange}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button size="icon" variant="ghost" onClick={handleIncrement}>
        <PlusCircle className="size-5" />
      </Button>
    </div>
  );
};
