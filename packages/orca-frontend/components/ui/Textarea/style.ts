import styled from 'styled-components';
import { TextAreaAutoSizeProps } from './TextAreaAutoSize';
import { darken } from 'polished';

export const Root = styled.textarea<TextAreaAutoSizeProps>`
  outline: 0;
  width: 100%;
  transition: border 0.1s;
  resize: none;
  border-radius: ${(p) => p.theme.radius.lg};
  border: ${(p) => (p.borderColor ? `1px solid ${p.theme.colors.border[p.borderColor]}` : 0)};
  background-color: ${(p) => (p.backgroundColorTone ? p.theme.colors.grey[p.backgroundColorTone] : 'transparent')};
  padding: 10px ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.xs};

  ${(p) =>
    p.borderColor &&
    `&:focus {
      border-color: ${darken(0.1, p.theme.colors.border[p.borderColor])}
  }`}
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;
