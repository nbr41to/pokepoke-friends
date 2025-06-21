import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {} from '@/components/ui/tooltip';
import { useFormContext } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
};

export const InputField = ({
  label,
  name,
  placeholder = '',
  required = false,
  description,
}: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              className="w-64"
              placeholder={placeholder}
              required={required}
              {...field}
            />
          </FormControl>
          <FormMessage className="font-bold" />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
