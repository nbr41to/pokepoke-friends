import cards from '@/constants/data/tools.json';
import Image from 'next/image';
import { CardFilterForm } from './_components/card-filter-form';

export default function Page() {
  return (
    <div className="">
      <div>
        <CardFilterForm />
      </div>

      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col items-center justify-center rounded-lg border p-4 shadow-md"
        >
          <h2 className="text-lg font-bold">{card.name}</h2>
          <Image
            src={card.image}
            alt={card.name}
            width={320}
            height={320}
            className="mt-2 rounded-lg"
          />
          <p className="text-sm text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
