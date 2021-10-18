import React, { FC } from 'react';

interface NotificationColorfulIconProps {
  width?: string;
  color?: string;
}

const NotificationColorfulIcon: FC<NotificationColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.66 39.94">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g id="Group_61" data-name="Group 61">
            <path
              id="Path_106"
              data-name="Path 106"
              fill="#ffce00"
              d="M26.64 22.22v10.69c0 .55-.18.72-.88.72H.86c-.7 0-.88-.16-.88-.72V12.38c0-4.5 4-7.7 9.6-7.71 3 0 6-.14 8.91.09 4.34.34 7.94 3.38 8 6.91s0 7 0 10.55Z"
            />
            <path
              id="Path_107"
              data-name="Path 107"
              fill="#ffb818"
              d="M26.65 22.21c0-3.52.09-7 0-10.55s-3.72-6.57-8-6.91c-1.73-.14-3.47-.14-5.2-.13v29h12.34c.7 0 .88-.16.87-.71-.03-3.58-.01-7.14-.01-10.7Z"
            />
            <path
              id="Path_108"
              data-name="Path 108"
              fill="#ffb818"
              d="M14.82 3.49v-2.4c0-.6-.66-1.09-1.49-1.09s-1.48.49-1.48 1.09v2.4Z"
            />
            <path id="Path_109" data-name="Path 109" fill="#ffb818" d="M17.23 36a3.92 3.92 0 1 1-7.83 0Z" />
            <path id="Path_110" data-name="Path 110" fill="#ffb818" d="M17.24 36a4 4 0 0 1-3.88 3.87V36Z" />
            <path id="Path_111" data-name="Path 111" fill="#ffb818" d="M13.26 0c-.82 0-1.49.49-1.49 1.09v2.39h1.49Z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default NotificationColorfulIcon;
