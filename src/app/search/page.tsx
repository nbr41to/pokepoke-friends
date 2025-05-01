import PokeBall from '@/components/icons/PokeBall';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import cards from '@/constants/data/tools.json';
import { HardHat, SquareUserRound, Wrench } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="">
      <div>
        <ToggleGroup type="multiple">
          <ToggleGroupItem
            defaultChecked
            value="pokemon"
            aria-label="Toggle bold"
          >
            <PokeBall />
          </ToggleGroupItem>
          <ToggleGroupItem
            defaultChecked
            value="trainer-support"
            aria-label="Toggle italic"
          >
            <SquareUserRound className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            defaultChecked
            value="trainer-goods"
            aria-label="Toggle underline"
          >
            <Wrench className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            defaultChecked
            value="trainer-pokemon-tools"
            aria-label="Toggle underline"
          >
            <HardHat className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md"
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
