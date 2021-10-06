import styled from 'styled-components';
import { ContainerProps } from './Container';

export const Root = styled.div<ContainerProps>`
  position: relative;
  margin: 0 auto;
  margin-top: ${(p) => (p.marginTop ? p.theme.spacing[p.marginTop] : 0)};
  width: 100%;
  max-width: ${(p) => p.maxWidth && p.theme.screen[p.maxWidth]};
  z-index: ${(p) => p.zIndex && p.theme.zIndex[p.zIndex]};
  padding: ${(p) => (p.padding ? `${p.theme.spacing[p.padding]}` : p.theme.spacing.sm)};
  border-radius: ${(p) => (p.radius ? p.theme.radius[p.radius] : p.theme.radius.md)};
  border: ${(p) => (p.bordered ? `1px solid ${p.theme.colors.border.main}` : 'none')};
  background-color: ${(p) => (p.bgColor ? p.theme.colors.general[p.bgColor] : 'transparent')};
  box-shadow: ${(p) => p.shadow && p.theme.shadows[p.shadow]};

  ${(p) =>
    p.centered &&
    `
    text-align: center;
  `};

  ${(p) =>
    p.paddingVertical &&
    `
    padding-top: ${p.theme.spacing[p.paddingVertical]};
    padding-bottom: ${p.theme.spacing[p.paddingVertical]};
  `};

  ${(p) =>
    p.paddingHorizontal &&
    `
    padding-left: ${p.theme.spacing[p.paddingHorizontal]};
    padding-right: ${p.theme.spacing[p.paddingHorizontal]};
  `};
`;
