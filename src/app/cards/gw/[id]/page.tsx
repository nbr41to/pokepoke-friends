import Image from 'next/image';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="">
      <div className="flex flex-wrap">
        <Image
          src={`https://img.gamewith.jp/article_tools/pokemon-tcg-pocket/gacha/m${
            id
          }.png`}
          alt="card"
          width={360}
          height={360}
        />
      </div>
    </div>
  );
}
