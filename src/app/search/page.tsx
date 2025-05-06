import { CardFilterForm } from './_components/card-filter-form';
import { CardList } from './_components/card-list';

export default function Page() {
  return (
    <div className="">
      <div>
        <CardFilterForm />
      </div>

      <CardList />
    </div>
  );
}
