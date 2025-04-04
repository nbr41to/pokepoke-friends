import styles from '@/styles/Home.module.css';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div>
      <header>
        <h1 className={`${styles.headerTitle}`}>ぽけぽけふれんず</h1>
      </header>

      <div>まあこのへん適当に</div>

      <Button> ここすきなテキスト </Button>
    </div>
  );
}
