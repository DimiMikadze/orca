import styled from 'styled-components';
import { Button } from '../ui';

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  background-color: ${(p) => p.theme.colors.general.primary};
  color: ${(p) => p.theme.colors.general.white};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.lg};
  line-height: 26px;
  font-weight: ${(p) => p.theme.font.weight.regular};
  z-index: ${(p) => p.theme.zIndex.xl};

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.sm};
    flex-direction: row;
    line-height: 18px;
  }
`;

export const Link = styled.a`
  transition: all 0.1s;
  color: ${(p) => p.theme.colors.general.white};
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

export const Iframe = styled.iframe`
  padding: 0;
  margin-top: 4px;

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    margin-left: ${(p) => p.theme.spacing.sm};
  }
`;

export const StyledButton = styled(Button)`
  position: absolute;
  right: ${(p) => p.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    right: ${(p) => p.theme.spacing.sm};
  }
`;
