import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';

type Props = {
  href?: string;
  icon: ReactNode;
  label: string;
};
export const HeaderMenuItem = ({ href, icon, label }: Props) => {
  return (
    <Button
      variant="link"
      className="w-12 justify-start overflow-x-hidden text-lg transition hover:w-fit"
      asChild
    >
      {href ? (
        <Link href={href}>
          {icon}
          {label}
        </Link>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
};
