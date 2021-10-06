import styled from 'styled-components';

const WIDTH = '48px';
const HEIGHT = '26px';
const RADIUS = '14px;';
const BALL_SIZE = '20px';

export const Root = styled.div`
  position: relative;
  display: inline-block;
`;

export const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: ${WIDTH};
  height: ${HEIGHT};
  border-radius: ${RADIUS};
  background: ${(p) => p.theme.colors.general.disabled};
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: ${BALL_SIZE};
    height: ${BALL_SIZE};
    margin: 3px;
    background: ${(p) => p.theme.colors.general.white};
    transition: 0.2s;
  }
`;

export const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: ${RADIUS};
  width: 48px;
  height: ${HEIGHT};

  &:checked + ${Label} {
    background: ${(p) => p.theme.colors.general.primary};
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: ${BALL_SIZE};
      height: ${BALL_SIZE};
      margin-left: 25px;
      transition: 0.2s;
    }
  }
`;
