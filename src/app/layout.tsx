import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import type { Metadata } from 'next';
import { Hachi_Maru_Pop } from 'next/font/google';

import '@/styles/globals.css';

const hachiMaruPop = Hachi_Maru_Pop({
  variable: '--font-noto-sans-jp',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ぽけぽけふれんず',
  description: 'めざせマスターランク',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${hachiMaruPop.variable} antialiased`}>
        <div className="mx-auto max-w-2xl">
          <Header />
          <div className="min-h-screen pb-12">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
