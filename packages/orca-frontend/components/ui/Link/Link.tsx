import { FC } from 'react';
import { default as NextLink } from 'next/link';
import { A } from './style';
import { FontWeight, FontSize, GeneralColors } from '../../../theme';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  weight?: FontWeight;
  size?: FontSize;
  color?: GeneralColors;
  disableBorderOnHover?: boolean;
  fullWidth?: boolean;
  block?: boolean;
}

const Link: FC<LinkProps> = ({ href, children, weight, size, color, disableBorderOnHover, fullWidth, block }) => {
  return (
    <NextLink href={href}>
      <A
        weight={weight}
        size={size}
        color={color}
        disableBorderOnHover={disableBorderOnHover}
        fullWidth={fullWidth}
        block={block}
      >
        {children}
      </A>
    </NextLink>
  );
};

export default Link;
