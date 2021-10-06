import React, { FC, FormEvent } from 'react';
import { SelectElement } from './style';

interface SelectProps {
  children: React.ReactNode;
  onChange: (e: FormEvent) => void;
  defaultValue: string;
  name: string;
}

const Select: FC<SelectProps> = ({ children, onChange, name, defaultValue }) => {
  return (
    <SelectElement name={name} onChange={onChange} defaultValue={defaultValue}>
      {children}
    </SelectElement>
  );
};

export default Select;
