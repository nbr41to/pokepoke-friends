import type React from 'react';

interface PokeBallProps {
  size?: number;
  className?: string;
}

export const PokeBall: React.FC<PokeBallProps> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 269 269"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>PokeBall Icon</title>
      <circle
        cx="134.5"
        cy="134.5"
        r="114.5"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="20"
      />
      <path d="M27,134.5 H241" stroke="#000000" strokeWidth="20" />
      <circle
        cx="134.5"
        cy="134.5"
        r="46"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="15"
      />
      <circle
        cx="134.5"
        cy="134.5"
        r="25"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="10"
      />
    </svg>
  );
};

export default PokeBall;
