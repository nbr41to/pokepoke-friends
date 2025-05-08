import { SearchForm } from './_components/search-form';
import { SearchResults } from './_components/search-results/search-results';

export default function Page() {
  return (
    <div className="">
      <div>
        <SearchForm />
      </div>

      <SearchResults />
    </div>
  );
}
