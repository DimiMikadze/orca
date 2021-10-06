import styled from 'styled-components';

export const Root = styled.div`
  overflow: hidden;
  border-radius: ${(p) => p.theme.radius.sm};
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing.xs};
  background-color: ${(p) => p.theme.colors.general.white};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};

  &:last-child {
    border-bottom: 0;
  }
`;

export const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: ${(p) => p.theme.spacing.xxs};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const PostImage = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
