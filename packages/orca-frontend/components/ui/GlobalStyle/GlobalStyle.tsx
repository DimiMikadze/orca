import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { Theme } from '../../../theme';
import nProgress from './nprogress';

interface GlobalStyleProps {
  theme: Theme;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  ${normalize()}
  ${(p) => nProgress(p.theme)}

  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: ${(p) => p.theme.font.family};
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.normal};
    color: ${(p) => p.theme.colors.general.text};
    background-color: ${(p) => p.theme.colors.general.body};
  }
`;

export default GlobalStyle;
