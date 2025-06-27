import { cn } from '@/utils/classnames';
import { normalizeStr } from '../utils';

type Props = {
  correctName: string;
  answer: string;
};

export const MatchResult = ({ correctName, answer }: Props) => {
  const normalizedCorrectName = normalizeStr(correctName);

  return (
    <div>
      <div className="grid grid-cols-5 gap-x-0.5">
        {answer.split('').map((char, index) => {
          const normalizedChar = normalizeStr(char);
          const matched = normalizedCorrectName[index] === normalizedChar;
          const included = normalizedCorrectName.includes(normalizedChar);

          return (
            <div
              key={index}
              className={cn(
                'flex size-8 items-center justify-center rounded-md border font-bold text-white md:size-12 md:text-2xl',
                matched
                  ? 'border-green-600 bg-green-500'
                  : included
                    ? 'border-yellow-600 bg-yellow-500'
                    : 'border-gray-600 bg-gray-500',
              )}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
};
