import React, { FC } from 'react';
import { Root, Label, CheckBox } from './style';

export interface InputTextProps {
  name: string;
  [x: string]: any;
}

const Toggle: FC<InputTextProps> = ({ name, ...props }) => {
  return (
    <Root>
      <CheckBox id={name} name={name} type="checkbox" {...props} />
      <Label htmlFor={name} />
    </Root>
  );
};

export default Toggle;
