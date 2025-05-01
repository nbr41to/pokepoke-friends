import Image from 'next/image';

export default function Home() {
  return (
    <div className="">
      <div className="flex flex-wrap">
        {Array.from({ length: 1000 }, (_, i) => (
          <Image
            key={i + 1}
            src={`https://img.gamewith.jp/article_tools/pokemon-tcg-pocket/gacha/m${
              i + 1
            }.png`}
            alt="card"
            width={100}
            height={100}
          />
        ))}
      </div>
    </div>
  );
}
