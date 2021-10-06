import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

interface ContainerProps {
  size?: number;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  transform: scale(${(p) => p.size});
`;

export const ImageContainer = styled.div`
  overflow: hidden;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const Online = styled.div`
  border: 1px solid ${(p) => p.theme.colors.general.white};
  background-color: ${(p) => p.theme.colors.general.success};
  width: 9px;
  height: 9px;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: -2px;
`;
