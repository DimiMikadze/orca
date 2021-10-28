import styled from 'styled-components';
import { Button } from '../ui';

export const StyledButton = styled(Button)`
  padding-left: ${(p) => p.theme.spacing.xxs};
  display: inline-block;
  font-weight: ${(p) => p.theme.font.weight.regular};
  color: ${(p) => p.theme.colors.general.textSecondary};

  &:hover {
    text-decoration: underline;
    color: ${(p) => p.theme.colors.general.textSecondary};
  }
`;
