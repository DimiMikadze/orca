import { DefaultCommunity } from '../constants';

export const SET_COMMUNITY_NAME = 'SET_COMMUNITY_NAME';
export const SET_COMMUNITY_LOGO = 'SET_COMMUNITY_LOGO';
export const SET_COMMUNITY_LOGO_PUBLIC_ID = 'SET_COMMUNITY_LOGO_PUBLIC_ID';
export const SET_PRIMARY_COLOR = 'SET_PRIMARY_COLOR';
export const SET_IS_EMAIL_VERIFICATION_REQUIRED = 'SET_IS_EMAIL_VERIFICATION_REQUIRED';

export interface Settings {
  communityName: string;
  communityLogo: string;
  communityLogoPublicId?: string;
  primaryColor: string;
  isEmailVerificationRequired: boolean;
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

export type SettingsActionTypes =
  | setCommunityNameActionType
  | setCommunityLogoActionType
  | setPrimaryColorActionType
  | setCommunityLogoPublicIdActionType
  | setIsEmailVerificationRequiredActionType;

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

// Reducer
const initialState: Settings = {
  communityName: DefaultCommunity.communityName,
  communityLogo: DefaultCommunity.communityLogo,
  communityLogoPublicId: DefaultCommunity.communityLogoPublicId,
  primaryColor: DefaultCommunity.primaryColor,
  isEmailVerificationRequired: DefaultCommunity.isEmailVerificationRequired,
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
    default:
      return state;
  }
}
