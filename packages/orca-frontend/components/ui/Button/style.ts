import styled from 'styled-components';
import get from 'lodash/get';
import { ButtonProps } from './Button';

export const Root = styled.button<ButtonProps>`
  letter-spacing: 0.5px;
  outline: 0;
  transition: opacity 0.1s;
  border: 0;
  color: ${(p) => (p.textColor ? p.theme.colors.general[p.textColor] : p.theme.colors.general.white)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.lg};
  background-color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.grey[20])};
  border-radius: ${(p) => (p.radius ? p.theme.radius[p.radius] : p.theme.radius.sm)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  ${(p) =>
    p.disabled &&
    `
    background-color: ${p.theme.colors.general.disabled};
    cursor: not-allowed;
  `};

  ${(p) =>
    p.inline &&
    `
    display: inline-block;
  `};

  ${(p) =>
    !p.disabled &&
    `
    &:hover {
      opacity .8;
      cursor: pointer;
    }
  `};

  ${(p) =>
    p.text &&
    `
    color: ${p.color ? get(p.theme.colors.general, p.color) : p.theme.colors.general.textSecondary};
    background-color: transparent;

    &:hover {
      background-color: ${p.theme.colors.grey[10]};
    }
  `};

  ${(p) =>
    p.ghost &&
    `
      color: ${p.color ? get(p.theme.colors.general, p.color) : p.theme.colors.general.textSecondary};
      border-radius: 0;
      background-color: transparent;
      padding: 0;
      text-align: left;
  `};

  ${(p) =>
    p.fullWidth &&
    `
    width: 100%;
  `}
`;

export const Link = styled.button<ButtonProps>`
  padding: 0;
  display: inline-block;
  border-bottom: 1px solid ${(p) => p.theme.colors.general.text};
  cursor: pointer;
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  background-color: transparent;
  border: 0;
`;
