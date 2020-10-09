import styled from 'styled-components';
import { css } from 'styled-components';
import { Link } from 'react-router-dom';

/**
 * Wrapper around React Router's Link component, that uses theme styling
 *
 * @param {string} color
 * @param {string} weight
 * @param {string} size
 */
export const A = styled(Link)`
  text-decoration: none;
  transition: color 0.1s;
  display: inline-block;
  color: ${(p) => (p.color ? p.theme.colors[p.color] : p.theme.colors.text.secondary)};
  font-weight: ${(p) => (p.weight ? p.theme.font.weight[p.weight] : p.theme.font.weight.normal)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.xs)};

  &:hover {
    color: ${(p) => p.theme.colors.text.primary};
  }
`;

/**
 * Component for wrapping error messages
 */
export const Error = styled.div`
  color: ${(p) => (p.color ? p.theme.colors[p.color] : p.theme.colors.error.main)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
`;

/**
 * Helper function for adding styles to Heading components
 *
 * @param {string} size, size of text
 */
const getHeadingStyles = (size) => css`
  margin: 0;
  font-size: ${size};
  font-weight: ${(p) => p.theme.font.weight.normal};
  color: ${(p) => (p.color ? p.theme.colors[p.color] : p.theme.colors.text.primary)};
`;

export const H1 = styled.h1`
  ${getHeadingStyles((p) => p.theme.font.size.xl)};
`;

export const H2 = styled.h2`
  ${getHeadingStyles((p) => p.theme.font.size.lg)};
`;

export const H3 = styled.h3`
  ${getHeadingStyles((p) => p.theme.font.size.xs)};
`;
