import type { Metadata } from 'next';
import { Hachi_Maru_Pop } from 'next/font/google';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa6';
import { FaUserPlus } from 'react-icons/fa6';
import { TbPokeball } from 'react-icons/tb';
import '@/styles/globals.css';

export const hachiMaruPop = Hachi_Maru_Pop({
  variable: '--font-noto-sans-jp',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ぽけぽけふれんず',
  description: 'ぽけぽけがんばる',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${hachiMaruPop.variable} antialiased max-w-md mx-auto bg-orange-50 min-h-dvh pb-12`}
      >
        <header className="border-b py-3">
          <h1 className="font-hachiMaru text-xl font-bold text-center">
            ぽけぽけふれんず。
          </h1>
        </header>
        {children}
        <footer className="h-12 max-w-md w-full border-t fixed bottom-0">
          <nav className="flex justify-around items-center h-full divide-x ">
            <Link
              href="/friends"
              className="grow h-full grid place-content-center"
            >
              <TbPokeball size={24} />
            </Link>
            <Link
              href="/friends"
              className="grow h-full grid place-content-center"
            >
              <FaUsers size={24} />
            </Link>
            <Link href="/" className="grow h-full grid place-content-center">
              <FaUserPlus size={24} />
            </Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
