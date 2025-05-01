import { UserCard } from './_components/user-card';

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="font-hachiMaru text-xl py-8 text-center">みんな</h1>

      <div className="space-y-4">
        <UserCard
          friendId="1111222233334444"
          lineName="のぶお"
          playerName="おのぶ"
        />
        <UserCard
          friendId="1111222233334444"
          lineName="onono"
          playerName="おのぶ"
        />
        <UserCard
          friendId="1111222233334444"
          lineName="のぶお"
          playerName="おのぶ"
        />
      </div>
    </div>
  );
}
