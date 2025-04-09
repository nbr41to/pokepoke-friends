import { Card } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { CopyButton } from './copy-button';

type Props = {
  friendId: string;
  lineName: string;
  playerName: string;
};

export const UserCard = ({ friendId, lineName, playerName }: Props) => {
  return (
    <Card className="p-4 bg-yellow-50 space-y-2">
      <div className="flex justify-between items-center font-hachiMaru py-2">
        <Label>LINEのなまえ</Label>
        <div className="font-bold">{lineName}</div>
      </div>
      <div className="flex justify-between items-center font-hachiMaru py-2">
        <Label>プレイヤーネーム</Label>
        <div className="font-bold">{playerName}</div>
      </div>
      <div className="flex justify-between items-center font-hachiMaru py-0.5">
        <Label>フレンドID</Label>
        <div className="flex items-center gap-x-2">
          <div className="font-sans">{friendId}</div>
          <CopyButton />
        </div>
      </div>
    </Card>
  );
};
