import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="">
      <div className="flex flex-wrap">
        {Array.from({ length: 5 }, (_, i) => (
          <Link
            key={i + 1}
            href={`/cards/gw/${i + 1}`}
            aria-label={`Card ${i + 1}`}
          >
            <Image
              src={`https://img.gamewith.jp/article_tools/pokemon-tcg-pocket/gacha/m${
                i + 1
              }.png`}
              alt="card"
              width={100}
              height={100}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
