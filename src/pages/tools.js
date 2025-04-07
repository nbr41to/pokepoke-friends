import styles from '@/styles/Home.module.css';
import { Button } from '@/components/Button';
import { useState } from 'react';

export default function Page() {
  const [wonCount, setWonCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);

  return (
    <div>
      <header>
        <h1 className={`${styles.headerTitle}`}>ぽけぽけふれんず</h1>
      </header>

      <div>まあこのへん適当に</div>

      <Button
        onClick={() => {
          setWonCount(wonCount + 1);
        }}
      >
        Win
      </Button>
      <Button
        onClick={() => {
          setLostCount(lostCount + 1);
        }}
      >
        Lose
      </Button>
      <div>
        <p>Won: {wonCount}</p>
        <p>Lost: {lostCount}</p>
        <p>Win Rate: {(wonCount / (wonCount + lostCount)) * 100}%</p>
        <p>Games Played: {wonCount + lostCount}</p>
      </div>
    </div>
  );
}
