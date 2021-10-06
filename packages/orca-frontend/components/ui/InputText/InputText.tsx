import React, { FC, useRef, useEffect } from 'react';
import { Input, Label, Description, Error } from './style';
import { BorderColors } from '../../../theme';

export interface InputTextProps {
  borderColor?: BorderColors;
  name: string;
  label?: string;
  description?: string;
  autoFocus?: boolean;
  error?: string;
  [x: string]: any;
}

const InputText: FC<InputTextProps> = ({ borderColor, error, name, label, description, autoFocus, ...otherProps }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    autoFocus && inputRef.current.focus();
  }, [autoFocus]);

  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      {description && <Description>{description}</Description>}
      {error && <Error>{error}</Error>}
      <Input ref={inputRef} borderColor={borderColor} error={error} name={name} {...otherProps} />
    </>
  );
};

export default InputText;
