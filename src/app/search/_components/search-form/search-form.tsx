'use client';
import { AcquisitionForm } from './acquisition-form';
import { CardTypeForm } from './card-type-form';
import { EvolveStageForm } from './evolve-stage-form';
import { HasAbilityForm } from './has-ability-form';
import { HitpointsForm } from './hitpoints-form';
import { KeywordForm } from './keyword-form';
import { MoveColorlessEnergyForm } from './move-colorless-energy-form';
import { MoveEnergyForm } from './move-energy-form';
import { MovePowerForm } from './move-power-form';
import { PokemonTypeForm } from './pokemon-type-form';
import { RarityForm } from './rarity-form';
import { ResetButton } from './reset-button';
import { RetreatCostForm } from './retreat-cost-form';

export const SearchForm = () => {
  return (
    <div className="space-y-3 px-3 py-2 select-none">
      <h2 className="font-hachiMaru text-center text-sm">- 検索条件 -</h2>
      <PokemonTypeForm />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <RarityForm />
        <CardTypeForm />
        <EvolveStageForm />
      </div>
      <HitpointsForm />
      <MovePowerForm />
      <MoveEnergyForm />
      <MoveColorlessEnergyForm />
      <RetreatCostForm />
      <HasAbilityForm />
      <AcquisitionForm />
      <div className="flex flex-col items-center justify-center gap-y-3">
        <KeywordForm />
        <ResetButton />
      </div>
    </div>
  );
};
