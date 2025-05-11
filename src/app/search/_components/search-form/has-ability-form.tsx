'use client';
import {} from '@/components/ui/radio-group';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/utils/classnames';
import { CircleCheckBig, CircleDashed } from 'lucide-react';
import { useSearchQuery } from '../../_utils/use-search-query';

export const HasAbilityForm = () => {
  const { query, setQuery } = useSearchQuery();

  const handleOnClickHasAbility = () => {
    const value =
      query.hasAbility === false ? true : query.hasAbility ? null : true;
    setQuery({ ...query, hasAbility: value });
  };
  const handleOnClickNoneAbility = () => {
    const value =
      query.hasAbility === true
        ? false
        : query.hasAbility === false
          ? null
          : false;
    setQuery({ ...query, hasAbility: value });
  };

  return (
    <div className="flex items-center justify-center gap-x-4">
      <Toggle
        className="rounded-full px-4"
        variant="outline"
        pressed={query.hasAbility === true}
        onClick={handleOnClickHasAbility}
      >
        <CircleCheckBig
          className={cn(query.hasAbility === true ? 'inline-block' : 'hidden')}
        />
        <CircleDashed
          className={cn(query.hasAbility === true ? 'hidden' : 'inline-block')}
        />
        特性あり
      </Toggle>
      <Toggle
        className="rounded-full px-4"
        variant="outline"
        pressed={query.hasAbility === false}
        onClick={handleOnClickNoneAbility}
      >
        <CircleCheckBig
          className={cn(query.hasAbility === false ? 'inline-block' : 'hidden')}
        />
        <CircleDashed
          className={cn(query.hasAbility === false ? 'hidden' : 'inline-block')}
        />
        特性なし
      </Toggle>
    </div>
  );
};
