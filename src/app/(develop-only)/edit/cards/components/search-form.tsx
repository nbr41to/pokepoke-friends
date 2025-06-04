import {
  AcquisitionForm,
  CardTypeForm,
  EvolveStageForm,
  HasAbilityForm,
  KeywordForm,
  PokemonTypeForm,
  RarityForm,
  ResetButton,
} from '@/components/search-form';

export const SearchForm = () => {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2 select-none">
      <PokemonTypeForm />
      <RarityForm />
      <CardTypeForm />
      <EvolveStageForm />
      <HasAbilityForm />
      <AcquisitionForm />
      <KeywordForm />
      <ResetButton />
    </div>
  );
};
