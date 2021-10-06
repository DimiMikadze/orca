import React, { FC } from 'react';
import theme from '../../../theme';

interface AccountColorfulIconProps {
  width?: string;
  color?: string;
}

const AccountColorfulIcon: FC<AccountColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M248 88c0 48.602-39.398 88-88 88s-88-39.398-88-88 39.398-88 88-88 88 39.398 88 88zm0 0M320 512H0V288c.055-44.16 35.84-79.945 80-80h160c44.16.055 79.945 35.84 80 80zm0 0"
        fill={theme.colors.general.warning}
      />
      <path d="M96 512H64V336c0-8.836 7.164-16 16-16s16 7.164 16 16zm0 0" fill={theme.colors.general.warning} />
      <path
        d="M477.008 342.398l30.305-41.359-33.489-57.984-50.96 5.554-16.704-9.601L385.473 192h-66.946l-20.687 46.93-16.703 9.597-50.961-5.55-33.489 57.984 30.305 41.437v19.204l-30.305 41.359 33.489 57.984 50.96-5.554 16.704 9.601L318.527 512h66.946l20.687-46.93 16.703-9.597 50.961 5.55 33.488-57.984-30.304-41.437zM352 400c-26.508 0-48-21.492-48-48s21.492-48 48-48 48 21.492 48 48-21.492 48-48 48zm0 0"
        fill={theme.colors.general.primary}
      />
      <g fill={theme.colors.general.primary}>
        <path d="M480 64h32v32h-32zm0 0M480 0h32v32h-32zm0 0M480 128h32v32h-32zm0 0M384 96h32v32h-32zm0 0M384 32h32v32h-32zm0 0" />
      </g>
    </svg>
  );
};

export default AccountColorfulIcon;
