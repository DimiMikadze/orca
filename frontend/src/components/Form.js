import styled from 'styled-components';
import { get } from 'lodash';

// prettier-ignore

/**
 * Button
 *
 * @param {string} size
 * @param {string} color
 * @param {boolean} disabled
 * @param {boolean} text, style button as a text
 */
export const Button = styled.button`
  letter-spacing: 0.5px;
  outline: 0;
  transition: opacity 0.1s;
  border: 0;
  color: ${p => p.theme.colors.white};
  font-size: ${p => p.size ? p.theme.font.size[p.size] : p.theme.font.size.xs};
  border-radius: ${p => p.theme.radius.sm};
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
  background-color: ${p => p.color ? p.theme.colors[p.color] : p.theme.colors.primary.main};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: ${p => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  white-space: nowrap;
  align-self: flex-start;

  ${p => p.disabled && `
    background-color: ${p.theme.colors.grey[500]};
    cursor: not-allowed;
  `};

  ${p => !p.disabled && `
    &:hover {
      opacity .9;
      cursor: pointer;
    }
  `};

  ${p => p.text && `
    color: ${p.color ? get(p.theme.colors, p.color) : p.theme.colors.text.secondary};
    border-radius: 0;
    background-color: transparent;
  `};

${p => p.ghost && `
    color: ${p.color ? get(p.theme.colors[p.color]) : p.theme.colors.text.secondary};
    border-radius: 0;
    background-color: transparent;
    padding: 0;
    text-align: left;
  `};

  ${p => p.fullWidth && `
    width: 100%;
  `}
`;

/**
 * Input type text
 */
export const InputText = styled.input`
  outline: 0;
  height: 36px;
  width: 100%;
  transition: border 0.1s;
  border-radius: ${p => p.theme.radius.sm};
  padding-left: ${p => p.theme.spacing.xs};
  border: 1px solid
    ${p =>
      p.borderColor ? p.theme.colors[p.borderColor] : p.theme.colors.grey[300]};
  color: ${p => p.theme.colors.text.secondary};

  &:focus {
    border-color: ${p => p.theme.colors.grey[400]};
  }
`;

/**
 * Textarea
 */
export const Textarea = styled.textarea`
  outline: 0;
  height: 50px;
  width: 100%;
  resize: none;
  border: 0;
  padding-left: ${p => p.theme.spacing.sm};
  padding-top: ${p => p.theme.spacing.xs};
  color: ${p => p.theme.colors.text.main};
  font-size: ${p => p.theme.font.size.xs};

  &::placeholder {
    color: ${p => p.theme.colors.text.secondary};
  }
`;

/**
 * Form component
 */
export const Form = styled.form`
  display: block;
  border-radius: ${p => p.theme.radius.sm};
  padding: ${p => p.theme.spacing.lg} ${p => p.theme.spacing.sm};
  background-color: ${p => p.theme.colors.white};
  border: 1px solid ${p => p.theme.colors.grey[300]};
`;
