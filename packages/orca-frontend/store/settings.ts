import { DefaultCommunity } from '../constants';

export const SET_COMMUNITY_NAME = 'SET_COMMUNITY_NAME';
export const SET_COMMUNITY_LOGO = 'SET_COMMUNITY_LOGO';
export const SET_COMMUNITY_LOGO_PUBLIC_ID = 'SET_COMMUNITY_LOGO_PUBLIC_ID';
export const SET_PRIMARY_COLOR = 'SET_PRIMARY_COLOR';
export const SET_IS_EMAIL_VERIFICATION_REQUIRED = 'SET_IS_EMAIL_VERIFICATION_REQUIRED';
export const SET_FACEBOOK_LOGIN_ENABLED = 'SET_FACEBOOK_LOGIN_ENABLED';
export const SET_GOOGLE_LOGIN_ENABLED = 'SET_GOOGLE_LOGIN_ENABLED';
export const SET_GITHUB_LOGIN_ENABLED = 'SET_GITHUB_LOGIN_ENABLED';

export interface Settings {
  communityName: string;
  communityLogo: string;
  communityLogoPublicId?: string;
  primaryColor: string;
  isEmailVerificationRequired: boolean;
  facebookLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  githubLoginEnabled: boolean;
}

export interface setCommunityNameActionType {
  type: typeof SET_COMMUNITY_NAME;
  payload: string;
}

export interface setCommunityLogoActionType {
  type: typeof SET_COMMUNITY_LOGO;
  payload: string;
}

export interface setCommunityLogoPublicIdActionType {
  type: typeof SET_COMMUNITY_LOGO_PUBLIC_ID;
  payload: string;
}

export interface setPrimaryColorActionType {
  type: typeof SET_PRIMARY_COLOR;
  payload: string;
}

export interface setIsEmailVerificationRequiredActionType {
  type: typeof SET_IS_EMAIL_VERIFICATION_REQUIRED;
  payload: boolean;
}

export interface setFacebookLoginEnabledActionType {
  type: typeof SET_FACEBOOK_LOGIN_ENABLED;
  payload: boolean;
}

export interface setGoogleLoginEnabledActionType {
  type: typeof SET_GOOGLE_LOGIN_ENABLED;
  payload: boolean;
}

export interface setGithubLoginEnabledActionType {
  type: typeof SET_GITHUB_LOGIN_ENABLED;
  payload: boolean;
}

export type SettingsActionTypes =
  | setCommunityNameActionType
  | setCommunityLogoActionType
  | setPrimaryColorActionType
  | setCommunityLogoPublicIdActionType
  | setIsEmailVerificationRequiredActionType
  | setFacebookLoginEnabledActionType
  | setGoogleLoginEnabledActionType
  | setGithubLoginEnabledActionType;

// Actions
export const setCommunityName = (name: string): SettingsActionTypes => {
  return {
    type: SET_COMMUNITY_NAME,
    payload: name,
  };
};

export const setCommunityLogo = (logo: string): SettingsActionTypes => {
  return {
    type: SET_COMMUNITY_LOGO,
    payload: logo,
  };
};

export const setCommunityLogoPublicId = (id: string): SettingsActionTypes => {
  return {
    type: SET_COMMUNITY_LOGO_PUBLIC_ID,
    payload: id,
  };
};

export const setPrimaryColor = (color: string): SettingsActionTypes => {
  return {
    type: SET_PRIMARY_COLOR,
    payload: color,
  };
};

export const setIsEmailVerificationRequired = (isRequired: boolean): SettingsActionTypes => {
  return {
    type: SET_IS_EMAIL_VERIFICATION_REQUIRED,
    payload: isRequired,
  };
};

export const setFacebookLoginEnabled = (isEnabled: boolean): SettingsActionTypes => {
  return {
    type: SET_FACEBOOK_LOGIN_ENABLED,
    payload: isEnabled,
  };
};

export const setGoogleLoginEnabled = (isEnabled: boolean): SettingsActionTypes => {
  return {
    type: SET_GOOGLE_LOGIN_ENABLED,
    payload: isEnabled,
  };
};

export const setGithubLoginEnabled = (isEnabled: boolean): SettingsActionTypes => {
  return {
    type: SET_GITHUB_LOGIN_ENABLED,
    payload: isEnabled,
  };
};

// Reducer
const initialState: Settings = {
  communityName: DefaultCommunity.communityName,
  communityLogo: DefaultCommunity.communityLogo,
  communityLogoPublicId: DefaultCommunity.communityLogoPublicId,
  primaryColor: DefaultCommunity.primaryColor,
  isEmailVerificationRequired: DefaultCommunity.isEmailVerificationRequired,
  facebookLoginEnabled: DefaultCommunity.facebookLoginEnabled,
  googleLoginEnabled: DefaultCommunity.googleLoginEnabled,
  githubLoginEnabled: DefaultCommunity.githubLoginEnabled,
};

export function settingsReducer(state = initialState, action: SettingsActionTypes): Settings {
  switch (action.type) {
    case SET_COMMUNITY_LOGO:
      return {
        ...state,
        communityLogo: action.payload,
      };
    case SET_COMMUNITY_LOGO_PUBLIC_ID:
      return {
        ...state,
        communityLogoPublicId: action.payload,
      };
    case SET_COMMUNITY_NAME:
      return {
        ...state,
        communityName: action.payload,
      };
    case SET_PRIMARY_COLOR:
      return {
        ...state,
        primaryColor: action.payload,
      };
    case SET_IS_EMAIL_VERIFICATION_REQUIRED:
      return {
        ...state,
        isEmailVerificationRequired: action.payload,
      };
    case SET_FACEBOOK_LOGIN_ENABLED:
      return {
        ...state,
        facebookLoginEnabled: action.payload,
      };
    case SET_GOOGLE_LOGIN_ENABLED:
      return {
        ...state,
        googleLoginEnabled: action.payload,
      };

    case SET_GITHUB_LOGIN_ENABLED:
      return {
        ...state,
        githubLoginEnabled: action.payload,
      };
    default:
      return state;
  }
}
