import { SearchForm } from './_components/search-form';
import { SearchResults } from './_components/search-results';

export default function Page() {
  return (
    <div className="space-y-6">
      <SearchForm />
      <SearchResults />
    </div>
  );
}
