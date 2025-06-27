import {
  AcquisitionForm,
  CardTypeForm,
  EvolveStageForm,
  HasAbilityForm,
  PokemonTypeForm,
  RarityForm,
  ResetButton,
} from '@/components/search-form';
import { KeywordDebounceForm } from '@/components/search-form/keyword-debounce-form';

export const SearchForm = () => {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2 select-none">
      <PokemonTypeForm />
      <RarityForm />
      <CardTypeForm />
      <EvolveStageForm />
      <HasAbilityForm />
      <AcquisitionForm />
      <KeywordDebounceForm />
      <ResetButton />
    </div>
  );
};
