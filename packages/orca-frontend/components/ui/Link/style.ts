import styled from 'styled-components';
import { FontWeight, FontSize, GeneralColors, Radius } from '../../../theme';

interface AProps {
  weight?: FontWeight;
  size?: FontSize;
  color?: GeneralColors;
  disableBorderOnHover: boolean;
  fullWidth: boolean;
  block: boolean;
}

export const A = styled.a<AProps>`
  cursor: pointer;
  text-decoration: none;
  transition: color 0.1s;
  display: inline-block;
  color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.link)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.md)};
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  white-space: pre-wrap;
  ${(p) => p.fullWidth && 'width: 100%'};

  ${(p) => p.block && 'display:block'};

  ${(p) =>
    !p.disableBorderOnHover &&
    `border-bottom: 1px solid transparent;

    &:hover {
      border-bottom: 1px solid ${p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.link};
  }`}
`;

interface ButtonAProps {
  weight?: FontWeight;
  size?: FontSize;
  fullWidth?: boolean;
  center?: boolean;
  color?: GeneralColors;
  radius?: Radius;
  active: boolean;
  hasHover?: boolean;
}

export const ButtonA = styled.a<ButtonAProps>`
  font-size: ${(p) => p.theme.font.size.md};
  padding: ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => (p.radius ? p.theme.radius[p.radius] : p.theme.radius.sm)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
  width: ${(p) => (p.fullWidth ? '100%' : 'auto')};
  justify-content: ${(p) => (p.center ? 'center' : 'flex-start')};
  color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.link)};
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  white-space: pre-wrap;
  cursor: pointer;
  ${(p) => p.active && `color: ${p.theme.colors.general.primary}`};

  ${(p) =>
    p.hasHover &&
    `
  &:hover {
    background-color: ${p.theme.colors.grey[10]};
  }
  `}
`;
