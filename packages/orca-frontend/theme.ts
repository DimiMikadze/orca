export type FontWeight = 'light' | 'normal' | 'bold';
export type FontSize = 'tiny' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Radius = 'sm' | 'md' | 'lg' | 'none';
export type Shadows = 'sm' | 'md' | 'lg' | 'xl';
export type Screen = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
export type Spacing = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZIndex = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BorderColors = 'light' | 'main' | 'dark';
export type GreyColors = 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
export type SocialColors = 'facebook' | 'twitter' | 'linkedIn' | 'github';
export type GeneralColors =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'link'
  | 'body'
  | 'white'
  | 'text'
  | 'textSecondary'
  | 'disabled'
  | 'transparent';

interface IFont {
  family: string;
  weight: { [key in FontWeight]: string };
  size: { [key in FontSize]: string };
}
type IShadows = { [key in Shadows]: string };
type IScreen = { [key in Screen]: string };
type ISpacing = { [key in Spacing]: string };
type IRadius = { [key in Radius]: string };
type IZIndex = { [key in ZIndex]: number };
export interface IColors {
  general: { [key in GeneralColors]: string };
  border: { [key in BorderColors]: string };
  grey: { [key in GreyColors]: string };
  social: { [key in SocialColors]: string };
}

export interface Theme {
  font: IFont;
  screen: IScreen;
  spacing: ISpacing;
  shadows: IShadows;
  radius: IRadius;
  zIndex: IZIndex;
  colors: IColors;
}

const theme: Theme = {
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    weight: {
      light: '300',
      normal: '400',
      bold: '600',
    },
    size: {
      tiny: '11px',
      xxs: '13px',
      xs: '14px',
      sm: '16px',
      md: '18px',
      lg: '20px',
      xl: '34px',
    },
  },

  colors: {
    general: {
      primary: '#0084FF',
      secondary: '#f50057',
      success: '#00A699',
      warning: '#FFB818',
      info: '#4169E1',
      error: '#F44335',
      link: '#0073F5',
      body: '#F5F6F7',
      white: '#fff',
      text: '#050505',
      textSecondary: '#64676B',
      disabled: '#CDD0D4',
      transparent: 'transparent',
    },

    border: {
      light: '#f5f5f5',
      main: '#e0e0e0',
      dark: '#bdbdbd',
    },

    social: {
      facebook: '#385898',
      twitter: '#1DA1F2',
      linkedIn: '#2867B2',
      github: '#171515',
    },

    grey: {
      5: '#F2F3F5',
      10: '#EBEDF0',
      20: '#DADDE1',
      30: '#CCD0D5',
      40: '#BEC3C9',
      50: '#8D949E',
      60: '#606770',
      70: '#444950',
      80: '#303338',
      90: '#1C1E21',
    },
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)',
    md: 'rgba(0, 0, 0, 0.3) 0px 1px 8px 0px',
    lg: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    xl: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },

  screen: {
    xs: '540px',
    sm: '640px',
    md: '1007px',
    lg: '1100px',
    xl: '1230px',
    xxl: '1440px',
    xxxl: '1920px',
  },

  spacing: {
    none: '0',
    xxs: '5px',
    xs: '10px',
    sm: '20px',
    md: '30px',
    lg: '40px',
    xl: '60px',
  },

  radius: {
    none: '0',
    sm: '8px',
    md: '12px',
    lg: '16px',
  },

  zIndex: {
    xs: 10,
    sm: 20,
    md: 30,
    lg: 40,
    xl: 50,
  },
};

export default theme;
