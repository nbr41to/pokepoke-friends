'use client';

import { CardTypeForm } from './card-type-form';
import { HitpointsForm } from './hitpoints-form';
import { KeywordForm } from './keyword-form';
import { MovePowerForm } from './move-power-form';
import { PokemonTypeForm } from './pokemon-type-form';
import { RarityForm } from './rarity-form';

export const CardFilterForm = () => {
  return (
    <div className="flex flex-col items-center gap-y-3">
      <PokemonTypeForm />
      <CardTypeForm />
      <HitpointsForm />
      <MovePowerForm />
      <RarityForm />
      <KeywordForm />
    </div>
  );
};
