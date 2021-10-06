import { FC } from 'react';
import { default as NextLink } from 'next/link';
import { ButtonA } from './style';
import { FontWeight, FontSize, GeneralColors, Radius } from '../../../theme';

interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  weight?: FontWeight;
  size?: FontSize;
  fullWidth?: boolean;
  center?: boolean;
  color?: GeneralColors;
  radius?: Radius;
  active?: boolean;
  hasHover?: boolean;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  children,
  weight,
  size,
  fullWidth,
  center,
  color,
  radius,
  active,
  hasHover,
}) => {
  return (
    <NextLink href={href}>
      <ButtonA
        weight={weight}
        size={size}
        fullWidth={fullWidth}
        center={center}
        color={color}
        radius={radius}
        active={active}
        hasHover={hasHover}
      >
        {children}
      </ButtonA>
    </NextLink>
  );
};

export default ButtonLink;
