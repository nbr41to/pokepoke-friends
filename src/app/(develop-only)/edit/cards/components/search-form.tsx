'use client';
import { AcquisitionForm } from '@/app/search/_components/search-form/acquisition-form';
import { CardTypeForm } from '@/app/search/_components/search-form/card-type-form';
import { EvolveStageForm } from '@/app/search/_components/search-form/evolve-stage-form';
import { HasAbilityForm } from '@/app/search/_components/search-form/has-ability-form';
import { HitpointsForm } from '@/app/search/_components/search-form/hitpoints-form';
import { KeywordForm } from '@/app/search/_components/search-form/keyword-form';
import { MoveColorlessEnergyForm } from '@/app/search/_components/search-form/move-colorless-energy-form';
import { MoveEnergyForm } from '@/app/search/_components/search-form/move-energy-form';
import { MovePowerForm } from '@/app/search/_components/search-form/move-power-form';
import { PokemonTypeForm } from '@/app/search/_components/search-form/pokemon-type-form';
import { RarityForm } from '@/app/search/_components/search-form/rarity-form';
import { ResetButton } from '@/app/search/_components/search-form/reset-button';
import { RetreatCostForm } from '@/app/search/_components/search-form/retreat-cost-form';

export const SearchForm = () => {
  return (
    <div className="space-y-3 px-3 py-2 select-none">
      <div className="flex gap-x-2">
        <PokemonTypeForm />
        <RarityForm />
        <CardTypeForm />
        <EvolveStageForm />
        <HasAbilityForm />
      </div>
      <div className="hidden gap-x-2">
        <HitpointsForm />
        <MovePowerForm />
        <MoveEnergyForm />
        <MoveColorlessEnergyForm />
        <RetreatCostForm />
      </div>
      <div className="flex justify-between gap-x-2">
        <AcquisitionForm />
        <KeywordForm />
        <ResetButton />
      </div>
    </div>
  );
};
