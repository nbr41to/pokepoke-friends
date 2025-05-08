import { Badge } from '@/components/ui/badge';
import {
  ACQUISITION_LABEL,
  ACQUISITION_LIST,
} from '@/constants/types/acquisition';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="font-hachiMaru text-center text-xl">
        しゅうろくカードたち
      </h2>

      <div className="flex flex-col items-center justify-center gap-y-2">
        {ACQUISITION_LIST.map((acquisition) => (
          <Link
            key={acquisition}
            href={`/acquisition/${acquisition}`}
            aria-label={ACQUISITION_LABEL[acquisition]}
            className="font-hachiMaru flex items-center gap-x-3 border-2 border-b-2 border-white px-4 py-2 text-xl hover:border-b-gray-600"
          >
            <span>{ACQUISITION_LABEL[acquisition]}</span>
            <Badge className="rounded-full pb-1 text-base font-bold">
              {acquisition}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
