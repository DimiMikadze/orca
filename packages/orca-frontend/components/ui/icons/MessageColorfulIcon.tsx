import React, { FC } from 'react';

interface MessageColorfulIconProps {
  width?: string;
  color?: string;
}

const MessageColorfulIcon: FC<MessageColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.68 28.54">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g id="Group_62" data-name="Group 62">
            <path
              id="Path_112"
              data-name="Path 112"
              d="M17.36 0h10.08a7 7 0 0 1 6.84 4.87 7.36 7.36 0 0 1 .37 2.28v10.79a7.06 7.06 0 0 1-5.66 7 8.85 8.85 0 0 1-1.71.16H13.41a.77.77 0 0 0-.62.25c-.9.92-1.81 1.82-2.72 2.73a1.06 1.06 0 0 1-1.48.27 1 1 0 0 1-.27-.26Q6.8 26.54 5.26 25a1.38 1.38 0 0 0-.5-.32A6.94 6.94 0 0 1 0 18.22V7a7.07 7.07 0 0 1 7.15-7h10.21Zm0 9.74H10.9a1 1 0 0 0-1 1v.13a1 1 0 0 0 1.14.92h12.58a2 2 0 0 0 .34 0 1 1 0 0 0-.27-2Zm0 3.58h-6.44a1 1 0 0 0-1 1 .17.17 0 0 0 0 .1 1 1 0 0 0 1.08 1h12.7a1 1 0 0 0 1-.58 1 1 0 0 0-.45-1.34 1 1 0 0 0-.51-.11Z"
              fill="#4169e1"
            />
            <path
              id="Path_113"
              data-name="Path 113"
              fill="#d5defa"
              d="M17.36 9.74h6.33a1 1 0 0 1 .26 2 1.88 1.88 0 0 1-.34 0H11.07a1 1 0 0 1-1.17-.88 1 1 0 0 1 .87-1.09h6.59Z"
            />
            <path
              id="Path_114"
              data-name="Path 114"
              fill="#d5defa"
              d="M17.34 13.32h6.39a1 1 0 0 1 1.07.93.94.94 0 0 1-.11.52 1 1 0 0 1-1 .58H11.06a1 1 0 0 1-1.16-.89v-.08a1 1 0 0 1 .91-1.05h6.53Z"
            />
            <path
              id="Path_115"
              data-name="Path 115"
              fill="#fff"
              d="M17.34 13.33h-6.42a1 1 0 0 0-1 .95.17.17 0 0 0 0 .1 1 1 0 0 0 1.08 1h6.36Z"
            />
            <path
              id="Path_116"
              data-name="Path 116"
              fill="#fff"
              d="M17.34 9.74H10.9a1 1 0 0 0-1 1v.12a1 1 0 0 0 1.14.92h6.31Z"
            />
            <path
              id="Path_117"
              data-name="Path 117"
              d="M17.34 15.35h-6.28a1 1 0 0 1-1.16-.88v-.08a1 1 0 0 1 .91-1.06h6.53v-1.56h-6.27a1 1 0 0 1-1.17-.89 1 1 0 0 1 .87-1.09h6.56V0H7.2A7.07 7.07 0 0 0 0 7v11.19a6.91 6.91 0 0 0 4.73 6.48 1.58 1.58 0 0 1 .5.32l3.06 3a1.07 1.07 0 0 0 1.49.26 1 1 0 0 0 .26-.27c.91-.9 1.82-1.81 2.72-2.73a.81.81 0 0 1 .62-.25h3.92Z"
              fill="#87a4fd"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default MessageColorfulIcon;
