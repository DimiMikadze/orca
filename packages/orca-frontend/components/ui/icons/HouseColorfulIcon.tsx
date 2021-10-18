import React, { FC } from 'react';

interface HouseColorfulIconProps {
  width?: string;
  color?: string;
}

const HouseColorfulIcon: FC<HouseColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.5 32.65">
      <g data-name="Layer 2">
        <g data-name="Layer 1">
          <path
            data-name="Path 67"
            d="M19.34 27.76v-3.54a1.68 1.68 0 0 0-1.51-1.84h-3.22a1.54 1.54 0 0 0-1.55 1.52c0 2.18 0 4.36-.06 6.54v1.24a.87.87 0 0 1-.82.93h-.06c-1.81 0-3.62.07-5.43 0a3.45 3.45 0 0 1-3.26-3.53V19.8c0-.49 0-.48-.49-.5a2.88 2.88 0 0 1-2.66-1.76 3 3 0 0 1 .61-3.36l3.25-3.27q5-5 9.89-9.94a3 3 0 0 1 2.87-.9 2.72 2.72 0 0 1 1.4.76q6.7 6.69 13.32 13.4a2.79 2.79 0 0 1 .61 3.24 2.82 2.82 0 0 1-2.71 1.84c-.53 0-.53 0-.53.55v9.41a3.49 3.49 0 0 1-3.36 3.36h-5.22a1 1 0 0 1-1.06-.89v-.18c-.01-1.27-.01-2.56-.01-3.8Z"
            fill="#00a699"
          />
          <path
            data-name="Path 68"
            d="M16.24 0A3 3 0 0 0 14 1q-4.95 5-9.89 9.94C3.05 12 2 13.08.88 14.18a3 3 0 0 0-.61 3.35A2.87 2.87 0 0 0 3 19.3c.49 0 .49 0 .49.49v9.28a3.45 3.45 0 0 0 3.26 3.53c1.8.08 3.61 0 5.42 0a.88.88 0 0 0 .88-.88v-1.3c0-2.18 0-4.35.06-6.53a1.54 1.54 0 0 1 1.54-1.54h1.59Z"
            fill="#04d3c3"
          />
        </g>
      </g>
    </svg>
  );
};

export default HouseColorfulIcon;
