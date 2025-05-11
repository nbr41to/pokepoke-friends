import { Search } from 'lucide-react';
import Link from 'next/link';
import PokeBall from '../icons/PokeBall';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 z-10 h-12 w-full max-w-2xl border-t bg-white">
      <nav className="flex h-full items-center justify-around divide-x">
        <Link href="/" className="grid h-full grow place-content-center">
          <PokeBall size={24} />
        </Link>
        {/* <Link href="/friends" className="grid h-full grow place-content-center">
          <UserRoundSearch size={24} />
        </Link>
        <Link href="/" className="grid h-full grow place-content-center">
          <Calculator size={24} />
        </Link> */}
        <Link href="/search" className="grid h-full grow place-content-center">
          <Search size={24} />
        </Link>
      </nav>
    </footer>
  );
};
