export const SET_COMMUNITY_NAME = 'SET_COMMUNITY_NAME';
export const SET_COMMUNITY_LOGO = 'SET_COMMUNITY_LOGO';
export const SET_COMMUNITY_LOGO_PUBLIC_ID = 'SET_COMMUNITY_LOGO_PUBLIC_ID';
export const SET_PRIMARY_COLOR = 'SET_PRIMARY_COLOR';

export interface Settings {
  communityName: string;
  communityLogo: string;
  communityLogoPublicId?: string;
  primaryColor: string;
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

export type SettingsActionTypes =
  | setCommunityNameActionType
  | setCommunityLogoActionType
  | setPrimaryColorActionType
  | setCommunityLogoPublicIdActionType;

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

// Reducer
const initialState: Settings = {
  communityName: 'Orca',
  communityLogo: 'https://bit.ly/3cjuNnr',
  communityLogoPublicId: '',
  primaryColor: '#0084FF',
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
    default:
      return state;
  }
}
