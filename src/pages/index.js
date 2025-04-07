import styles from "@/styles/Home.module.css";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
  const response = await fetch("https://apex.oracle.com/pls/apex/gamelive/pokemon/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${yourApiKey}`, 
    },
  });
  const result = await response.json();
  setData(result.pokemon);
      } catch (error) {
        console.error("データ取得に失敗しました:", error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

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
