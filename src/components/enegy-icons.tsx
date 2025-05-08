import { POKEMON_MOVE_ENERGY } from '@/constants/types/pokemon-status';
import { POKEMON_TYPE } from '@/constants/types/pokemon-types';
import Image from 'next/image';

type Props = {
  energies: string; // ex: 'GCC' (草、無色、無色)
  size?: number; // optional size prop
};
export const EnergyIcons = ({ energies, size = 14 }: Props) => {
  return (
    <span className="inline-flex items-center gap-x-0.5">
      {energies.split('').map((energy, index) => {
        const energyType =
          POKEMON_MOVE_ENERGY[energy as keyof typeof POKEMON_MOVE_ENERGY];
        const imageIndex = Object.values(POKEMON_TYPE).indexOf(energyType);

        return (
          <Image
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`${energy}-${index}`}
            src={`/type${imageIndex + 1}.png`}
            alt={energy}
            width={size}
            height={size}
            style={{ width: `${size}px`, height: `${size}px` }}
            unoptimized
          />
        );
      })}
    </span>
  );
};
