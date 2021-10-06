import styled from 'styled-components';
import { Button } from '../../ui';

export const StyledButton = styled(Button)`
  visibility: hidden;
  padding-top: ${(p) => p.theme.spacing.xxs};
  padding-right: ${(p) => p.theme.spacing.xxs};
`;

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xxs};

  &:hover ${StyledButton} {
    visibility: visible;
  }
`;

export const Container = styled.div`
  position: relative;
  padding: ${(p) => p.theme.spacing.xs};
  margin: 0 ${(p) => p.theme.spacing.xs};
  background-color: ${(p) => p.theme.colors.grey[10]};
  border-radius: ${(p) => p.theme.radius.lg};
  margin-left: ${(p) => p.theme.spacing.xxs};
`;

export const UserName = styled.div`
  color: ${(p) => p.theme.colors.general.primary};
  margin-bottom: 2px;
`;
