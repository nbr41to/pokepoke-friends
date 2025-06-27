import {
  AcquisitionForm,
  CardTypeForm,
  EvolveStageForm,
  HasAbilityForm,
  HitpointsForm,
  MoveColorlessEnergyForm,
  MoveEnergyForm,
  MovePowerForm,
  PokemonTypeForm,
  RarityForm,
  ResetButton,
  RetreatCostForm,
} from '@/components/search-form';
import { KeywordDebounceForm } from '@/components/search-form/keyword-debounce-form';

export const SearchForm = () => {
  return (
    <div className="flex flex-col items-center gap-y-3 px-3 py-2 select-none">
      <h2 className="font-hachiMaru text-center text-sm">- 検索条件 -</h2>

      <PokemonTypeForm />
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <RarityForm />
        <CardTypeForm />
        <EvolveStageForm />
        <HasAbilityForm />
      </div>

      <div className="flex flex-col items-start gap-y-3">
        <HitpointsForm />
        <MovePowerForm />
        <MoveEnergyForm />
        <MoveColorlessEnergyForm />
        <RetreatCostForm />
      </div>

      <div className="mx-auto w-full max-w-[600px] space-y-3">
        <AcquisitionForm />
        <KeywordDebounceForm />
      </div>

      <div className="flex flex-col items-center justify-center gap-y-3">
        <ResetButton />
      </div>
    </div>
  );
};
