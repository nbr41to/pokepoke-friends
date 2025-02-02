'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z.object({
  lineName: z.string().min(1, { message: '1文字以上で入力してください' }),
  playerName: z.string().min(1, { message: '1文字以上で入力してください' }),
  friendId: z.string().length(16, { message: '16文字で入力してください' }),
});

export const SignupForm = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      lineName: '',
      playerName: '',
      friendId: '',
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="lineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hachiMaru">LINEのなまえ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hachiMaru">プレイヤーネーム</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="friendId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hachiMaru">
                フレンドID（16けた ハイフンなし）
              </FormLabel>
              <FormControl>
                <Input
                  className="font-bold tracking-wider"
                  inputMode="numeric"
                  placeholder="1111222233334444"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="font-hachiMaru text-xs text-right">
                そのまま貼り付ければOK!!
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="text-center">
          <Button
            className="font-hachiMaru"
            size="lg"
            type="submit"
            variant="primary"
          >
            とうろくする
          </Button>
        </div>
      </form>
    </Form>
  );
};
