import styled from 'styled-components';
import { InputTextProps } from './InputText';

export const Input = styled.input<InputTextProps>`
  outline: 0;
  height: 36px;
  width: 100%;
  transition: border 0.1s;
  border-radius: ${(p) => p.theme.radius.sm};
  padding-left: ${(p) => p.theme.spacing.xs};
  border: 1px solid ${(p) => (p.error ? p.theme.colors.general.error : p.theme.colors.grey[40])};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.sm};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }

  &:focus {
    background-color: ${(p) => p.theme.colors.general.white};
    border: 1px solid ${(p) => (p.error ? p.theme.colors.general.error : p.theme.colors.general.link)};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.grey[90]};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

export const Description = styled.p`
  color: ${(p) => p.theme.colors.general.textSecondary};
  margin-top: 0;
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;

export const Error = styled.div`
  color: ${(p) => p.theme.colors.general.error};
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;
