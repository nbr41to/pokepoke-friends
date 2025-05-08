'use client';

import { AcquisitionForm } from './acquisition-form';
import { CardTypeForm } from './card-type-form';
import { HitpointsForm } from './hitpoints-form';
import { KeywordForm } from './keyword-form';
import { MovePowerForm } from './move-power-form';
import { PokemonTypeForm } from './pokemon-type-form';
import { RarityForm } from './rarity-form';
import { RetreatCostForm } from './retreat-cost-form';

export const SearchForm = () => {
  return (
    <div className="space-y-3 p-2">
      <PokemonTypeForm />
      <div className="flex items-center gap-3">
        <CardTypeForm />
        <RarityForm />
      </div>
      <HitpointsForm />
      <MovePowerForm />
      <RetreatCostForm />
      <AcquisitionForm />
      <KeywordForm />
    </div>
  );
};
