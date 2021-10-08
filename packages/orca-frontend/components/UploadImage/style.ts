import styled from 'styled-components';

export const Input = styled.input`
  display: none;
`;

interface LabelProps {
  isCover?: boolean;
}

export const Label = styled.label<LabelProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-weight: ${(p) => p.theme.font.weight.bold};
  font-size: ${(p) => p.theme.font.size.xxs};
  background-color: rgb(255, 255, 255, 0.7);
  padding: ${(p) => p.theme.spacing.xxs};
  border-radius: ${(p) => p.theme.radius.lg};
  transition: background-color 0.2s;

  ${(p) => p.isCover && `padding: ${p.theme.spacing.xxs} ${p.theme.spacing.xs};`}

  &:hover {
    background-color: rgb(255, 255, 255, 0.9);
  }
`;

export const Text = styled.div`
  margin-left: ${(p) => p.theme.spacing.xxs};
`;
