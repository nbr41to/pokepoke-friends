import { z } from 'zod';

export const schema = z.object({
  friendId: z
    .string()
    .min(1, 'フレンドIDは必須です')
    .regex(
      /^[0-9]{16}$/,
      'フレンドIDはハイフンなし16桁の半角数字で入力してください',
    ),
  playerName: z
    .string()
    .min(1, 'プレイヤー名は必須です')
    .max(8, '8文字以内で入力してください'),
  secretWord: z
    .string()
    .max(10, 'ひみつのことばは10文字以内で入力してください'),
});
