import styled from 'styled-components';
import { Button } from '../ui';

interface RootProps {
  isFollowing: boolean;
}

export const Root = styled(Button)<RootProps>`
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xs};
  border: 1px solid ${(p) => p.theme.colors.general.primary};
  color: ${(p) => p.theme.colors.general.primary};
  font-weight: ${(p) => p.theme.font.weight.bold};
  background-color: transparent;

  &:hover {
    opacity: 0.8;
  }

  ${(p) =>
    p.isFollowing &&
    `
    background-color: ${p.theme.colors.general.primary};
    color: ${p.theme.colors.general.white};
  `}
`;
