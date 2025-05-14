import { Suspense } from 'react';
import { ScrollTopButton } from './_components/scroll-top-button';
import { SearchForm } from './_components/search-form';
import { SearchResults } from './_components/search-results';

export default function Page() {
  return (
    <Suspense>
      <div className="space-y-6">
        <ScrollTopButton />
        <SearchForm />
        <SearchResults />
      </div>
    </Suspense>
  );
}
