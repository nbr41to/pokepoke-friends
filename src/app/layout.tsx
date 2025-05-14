import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import type { Metadata, Viewport } from 'next';
import { Hachi_Maru_Pop } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import '@/styles/globals.css';
import { DevCommand } from '@/components/layout/dev-command';
import { Toaster } from '@/components/ui/sonner';

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

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="touch-manipulation">
      <body className={`${hachiMaruPop.variable} antialiased`}>
        <NuqsAdapter>
          <div className="mx-auto max-w-2xl md:max-w-full">
            <Header />
            <div className="min-h-screen pb-16">{children}</div>
            <Footer />
          </div>
        </NuqsAdapter>
        <Toaster />
        <DevCommand />
      </body>
    </html>
  );
}
