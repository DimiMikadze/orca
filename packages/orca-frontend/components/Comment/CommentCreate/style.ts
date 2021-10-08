import styled from 'styled-components';

export const Root = styled.form`
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: ${(p) => p.theme.spacing.xs};
`;

export const TextareaContainer = styled.div`
  padding-right: ${(p) => p.theme.spacing.xxs};
  margin-left: ${(p) => p.theme.spacing.xxs};
  width: 100%;
`;
