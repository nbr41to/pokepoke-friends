import { Search, UserRoundSearch } from 'lucide-react';
import Link from 'next/link';
import PokeBall from '../icons/PokeBall';

export const Footer = () => {
  return (
    <footer className="h-12 max-w-2xl w-full border-t fixed bottom-0">
      <nav className="flex justify-around items-center h-full divide-x ">
        <Link href="/friends" className="grow h-full grid place-content-center">
          <PokeBall size={24} />
        </Link>
        <Link href="/friends" className="grow h-full grid place-content-center">
          <UserRoundSearch size={24} />
        </Link>
        <Link href="/" className="grow h-full grid place-content-center">
          <UserRoundSearch size={24} />
        </Link>
        <Link href="/search" className="grow h-full grid place-content-center">
          <Search size={24} />
        </Link>
      </nav>
    </footer>
  );
};
