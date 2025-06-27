import Link from 'next/link';

export default function Page() {
  return (
    <div className="font-hachiMaru flex flex-col items-center space-y-4 p-4">
      <h1 className="font-hachiMaru text-xl font-bold">掲示板</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/socials/friend"
          className="grid h-40 w-40 place-content-center rounded-lg bg-orange-500 font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
        >
          フレンド掲示板
        </Link>
        <button
          // href="/socials/trade"
          type="button"
          disabled
          className="grid h-40 w-40 cursor-not-allowed place-content-center rounded-lg bg-teal-500 font-bold text-white shadow-lg transition-colors disabled:grayscale"
        >
          トレード掲示板
        </button>
      </div>
    </div>
  );
}
