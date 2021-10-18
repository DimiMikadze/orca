import React, { FC } from 'react';

interface UserIconProps {
  width?: string;
  color?: string;
}

const UserIcon: FC<UserIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.88 36.86">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g id="Group_73" data-name="Group 73">
            <path
              id="Path_128-2"
              data-name="Path 128-2"
              d="M18.45 0A18.43 18.43 0 1 1 0 18.43 18.43 18.43 0 0 1 18.45 0Z"
              fill="#4169e1"
            />
            <path id="Path_123-2" data-name="Path 123-2" d="M18.46 0a18.43 18.43 0 0 0-.06 36.86h.06Z" fill="#87a4fd" />
            <g id="Group_71-2" data-name="Group 71-2">
              <path
                id="Path_124-2"
                data-name="Path 124-2"
                fill="#ffb818"
                d="M18.65 29.17A11.64 11.64 0 0 1 8.25 23a.31.31 0 0 1 0-.41 6.23 6.23 0 0 1 3.94-2.26 6.61 6.61 0 0 1 1-.08h10.26a6.34 6.34 0 0 1 5.15 2.39.28.28 0 0 1 0 .36 11.53 11.53 0 0 1-7.75 5.91 12.23 12.23 0 0 1-1.21.21c-.29.02-.64.03-.99.05Z"
              />
              <path
                id="Path_125-2"
                data-name="Path 125-2"
                fill="#ffb818"
                d="M24.61 12.3a6.16 6.16 0 1 1-6.13-6.18h.16a6.1 6.1 0 0 1 5.97 6.18Z"
              />
            </g>
            <path
              id="Path_126-2"
              data-name="Path 126-2"
              fill="#ffce00"
              d="M18.45 20.24h-5.23a6.61 6.61 0 0 0-1 .08 6.26 6.26 0 0 0-3.94 2.26.31.31 0 0 0 0 .41 11.61 11.61 0 0 0 10.2 6.16Z"
            />
            <path id="Path_127-2" data-name="Path 127-2" fill="#ffce00" d="M18.45 6.12a6.16 6.16 0 0 0 0 12.31Z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default UserIcon;
