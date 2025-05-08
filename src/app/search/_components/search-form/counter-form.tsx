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
  value: number | null;
  onValueChange: (value: number | null) => void;
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
    if (newValue === 'null') {
      onValueChange(null);
      return;
    }
    const parsedValue = Number.parseInt(newValue, 10);
    if (!Number.isNaN(parsedValue)) {
      onValueChange(parsedValue);
    }
  };
  const handleIncrement = () => {
    const minCount = Math.min(...options);
    const maxCount = Math.max(...options);
    if (!value) {
      onValueChange(minCount);
      return;
    }
    if (value < maxCount) {
      onValueChange(value + renge);
    } else {
      onValueChange(null);
    }
  };
  const handleDecrement = () => {
    const minCount = Math.min(...options);
    const maxCount = Math.max(...options);
    if (!value) {
      onValueChange(maxCount);
      return;
    }
    if (value > minCount) {
      onValueChange(value - renge);
    } else {
      onValueChange(null);
    }
  };

  return (
    <div className="flex gap-x-1">
      <Button size="icon" variant="ghost" onClick={handleDecrement}>
        <MinusCircle className="size-5" />
      </Button>
      <Select
        value={value?.toString() || 'null'}
        onValueChange={handleOnValueChange}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            <SelectItem value="null">-</SelectItem>
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
