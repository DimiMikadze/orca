import styled from 'styled-components';
import { Button } from '../ui';

export const StyledButton = styled(Button)`
  padding-left: ${(p) => p.theme.spacing.xxs};
  display: inline-block;
`;
