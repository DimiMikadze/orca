import React, { FC } from 'react';

interface PeopleColorfulIconProps {
  width?: string;
  color?: string;
}

const PeopleColorfulIcon: FC<PeopleColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.75 28.94">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g id="Group_60" data-name="Group 60">
            <path
              id="Path_96"
              data-name="Path 96"
              fill="#ffb818"
              d="M27.15 21.34v-6.85a5.09 5.09 0 0 1 4-5 2.5 2.5 0 0 1 .38-.06 42.29 42.29 0 0 1 5.74 0 5 5 0 0 1 4.44 4.75c0 2.65.06 5.31 0 8a7.11 7.11 0 0 1-6.86 6.79c-2.43.05-4.86 0-7.29 0-.37 0-.41-.16-.4-.46Z"
            />
            <path
              id="Path_99"
              data-name="Path 99"
              fill="#ffb818"
              d="M34.47 8.54a4.26 4.26 0 1 1 4.24-4.31 4.26 4.26 0 0 1-4.24 4.31Z"
            />
            <path id="Path_102" data-name="Path 102" fill="#ffce00" d="M34.45 0a4.26 4.26 0 0 0 0 8.52Z" />
            <path
              id="Path_105"
              data-name="Path 105"
              fill="#ffce00"
              d="M34.45 9.3c-1 0-2 0-2.92.1a2.5 2.5 0 0 0-.38.06 5.1 5.1 0 0 0-4 5v14c0 .3 0 .46.4.45h6.9Z"
            />
            <path
              id="Path_94"
              data-name="Path 94"
              fill="#f48eb1"
              d="M28.13 21.23v7.22c0 .38-.1.49-.48.49H14.06c-.38 0-.48-.11-.48-.49V14.58a5 5 0 0 1 4.86-5.21h.38c1.62 0 3.25-.1 4.87.06a4.94 4.94 0 0 1 4.4 4.67c.06 2.37 0 4.75 0 7.13Z"
            />
            <path
              id="Path_95"
              data-name="Path 95"
              fill="#87a4fd"
              d="M14.58 21.35v7c0 .4-.07.55-.52.54H7.25A7.15 7.15 0 0 1 .16 23.2 7.63 7.63 0 0 1 0 21.62v-7.1a5 5 0 0 1 4.76-5.15 39 39 0 0 1 5.07 0 5 5 0 0 1 4.75 5.12c.01 2.29 0 4.58 0 6.86Z"
            />
            <path
              id="Path_97"
              data-name="Path 97"
              fill="#f50357"
              d="M20.88 8.54a4.29 4.29 0 0 1-4.29-4.28 4.28 4.28 0 0 1 8.55 0 4.28 4.28 0 0 1-4.26 4.28Z"
            />
            <path
              id="Path_98"
              data-name="Path 98"
              fill="#4169e1"
              d="M7.28 8.52a4.26 4.26 0 1 1 4.29-4.24 4.25 4.25 0 0 1-4.29 4.24Z"
            />
            <path id="Path_100" data-name="Path 100" fill="#87a4fd" d="M7.3 0a4.26 4.26 0 0 0 0 8.52Z" />
            <path
              id="Path_101"
              data-name="Path 101"
              fill="#f48eb1"
              d="M20.87 0a4.33 4.33 0 0 0-4.24 4.24 4.3 4.3 0 0 0 4.28 4.28Z"
            />
            <path
              id="Path_103"
              data-name="Path 103"
              fill="#4169e1"
              d="M14.58 21.34v-6.86a5 5 0 0 0-4.74-5.11c-.85 0-1.69-.08-2.54-.08v19.63h6.78c.44 0 .52-.14.52-.54-.03-2.38-.02-4.69-.02-7.04Z"
            />
            <path
              id="Path_104"
              data-name="Path 104"
              fill="#f50357"
              d="M28.14 21.22c0-2.37.05-4.75 0-7.13a4.92 4.92 0 0 0-4.4-4.66 26.86 26.86 0 0 0-2.84-.09v19.58h6.8c.39 0 .49-.11.48-.48-.05-2.44-.04-4.81-.04-7.22Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default PeopleColorfulIcon;
