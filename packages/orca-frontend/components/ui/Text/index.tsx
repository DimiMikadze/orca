import styled, { css } from 'styled-components';
import { FontSize, FontWeight, GeneralColors } from '../../../theme';

interface ErrorProps {
  size?: FontSize;
}

export const Error = styled.div<ErrorProps>`
  color: ${(p) => (p.color ? p.theme.colors[p.color] : p.theme.colors.error.main)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
`;

interface GetHeadingStylesProps {
  color?: GeneralColors;
  size?: FontSize;
}

const getHeadingStyles = (defaultSize: FontSize) => css<GetHeadingStylesProps>`
  margin: 0;
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size[defaultSize])};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.text)};
`;

export const H1 = styled.h1`
  ${getHeadingStyles('xl')};
`;

export const H2 = styled.h2`
  ${getHeadingStyles('lg')};
`;

export const H3 = styled.h3`
  ${getHeadingStyles('md')};
`;

interface PProps {
  size?: FontSize;
  color?: GeneralColors;
  weight?: FontWeight;
}

export const P = styled.p<PProps>`
  margin: 0;
  color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.text)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
`;

export const Text = styled.div<PProps>`
  display: inline-block;
  margin: 0;
  color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.text)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
`;
