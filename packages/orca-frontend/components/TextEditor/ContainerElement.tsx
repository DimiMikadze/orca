import { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import Linkify from '../Linkify';
import { StyledBlockQuote } from './style';

export const ContainerElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <StyledBlockQuote {...attributes}>
          <Linkify>{children}</Linkify>
        </StyledBlockQuote>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
