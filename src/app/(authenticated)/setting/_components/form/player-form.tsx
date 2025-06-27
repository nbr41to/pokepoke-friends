'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Player } from '@/generated/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { upsertPlayer } from './actions';
import { InputField } from './input-field';
import { schema } from './schema';

type Props = {
  player: Player | null;
  onClose: () => void;
};
export const PlayerForm = ({ player, onClose }: Props) => {
  const formMethods = useForm({
    defaultValues: {
      friendId: player?.friendId ?? '',
      playerName: player?.playerName ?? '',
      secretWord: player?.secretWord ?? '',
    },
    resolver: zodResolver(schema),
  });

  const handleOnSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await upsertPlayer(data);
      onClose();
    } catch (error) {
      console.error('Error upserting player:', error);
      alert('プレイヤーの登録に失敗しました。');
    }
  };

  return (
    <Form {...formMethods}>
      <form
        noValidate
        className="font-hachiMaru w-fit max-w-[290px] space-y-3 rounded-md border p-4"
        onSubmit={formMethods.handleSubmit(handleOnSubmit)}
      >
        <InputField
          label="フレンドID"
          name="friendId"
          placeholder="ハイフンなし16桁"
          required
        />
        <InputField
          label="プレイヤー名"
          name="playerName"
          placeholder="8文字以内"
          required
        />
        <InputField
          label="ひみつのことば"
          name="secretWord"
          placeholder="10文字以内"
          description="登録した「ことば」でプレイヤーを検索できるようになります。"
        />

        <Button
          type="submit"
          className="w-64"
          disabled={formMethods.formState.isSubmitting}
        >
          保存
        </Button>
      </form>
    </Form>
  );
};
