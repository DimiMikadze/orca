import { FC } from 'react';
import { StyledCodeBlock } from './style';
import { CustomRenderLeafProps } from './TextEditor';

const LeafElement: FC<CustomRenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <StyledCodeBlock>{children}</StyledCodeBlock>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default LeafElement;
