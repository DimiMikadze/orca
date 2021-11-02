import React, { FC, ReactNode } from 'react';
import LinkifyIt from 'linkify-it';

interface LinkifyProps {
  children: ReactNode;
}

const Linkify: FC<LinkifyProps> = ({ children }) => {
  const parseString = (string: string) => {
    if (string === '') {
      return string;
    }

    const linkify = new LinkifyIt();

    const matches = linkify.match(string);
    if (!matches) {
      return string;
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
      // Push the normal text as an element before the first link
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index));
      }

      // Create a link component for the actual url match
      const linkComponent = (
        <a href={match.url} key={i} rel="noreferrer noopener" target="_blank">
          {match.text}
        </a>
      );

      elements.push(linkComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      elements.push(string.substring(lastIndex));
    }

    return elements.length === 1 ? elements[0] : elements;
  };

  // Iterate over all the children and process any child node that contains text
  const parse = (children: ReactNode, key = 0) => {
    if (typeof children === 'string') {
      return parseString(children);
    } else if (React.isValidElement(children) && children.type !== 'a' && children.type !== 'button') {
      // Clone and return the element with all it's children
      return React.cloneElement(children, { key: key }, parse(children.props.children));
    } else if (Array.isArray(children)) {
      return children.map((child, i) => parse(child, i));
    }

    return children;
  };

  return <span>{parse(children)}</span>;
};

export default Linkify;
