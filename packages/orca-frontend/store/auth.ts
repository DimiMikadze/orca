import { Socket } from 'socket.io-client';
import { UserRole } from '../constants';

export interface AuthUser {
  _id: string;
  role: UserRole;
  email?: string;
  username?: string;
  image?: string;
  imagePublicId?: string;
  coverImagePublicId?: string;
  coverImage?: string;
  fullName?: string;
  facebookId?: string;
  googleId?: string;
  githubId?: string;
  about?: string;
  website?: string;
  notifications: any[];
  followers: any[];
  following: any[];
  isOnline: boolean;
}

export enum PopupType {
  Sign_Up = 'SIGN_UP',
  Log_In = 'LOG_IN',
  Forgot_Password = 'FORGOT_PASSWORD',
}

export interface AuthState {
  user: AuthUser | null;
  socket: Socket | null;
  token: string | null;
  isPopupOpen: boolean;
  popupType: null | PopupType;
}

export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_SOCKET = 'SET_SOCKET';
export const CLEAR_AUTH_USER = 'CLEAR_AUTH_USER';
export const OPEN_AUTH_POPUP = 'OPEN_AUTH_POPUP';
export const CLOSE_AUTH_POPUP = 'CLOSE_AUTH_POPUP';
export const ADD_USER_NOTIFICATION = 'ADD_USER_NOTIFICATION';
export const REMOVE_USER_NOTIFICATION = 'REMOVE_USER_NOTIFICATION';
export const CLEAN_USER_NOTIFICATIONS = 'CLEAN_USER_NOTIFICATIONS';
export const ADD_USER_IMAGE = 'ADD_USER_IMAGE';
export const ADD_USER_COVER = 'ADD_USER_COVER';
export const ADD_USER_FOLLOWING = 'ADD_USER_FOLLOWING';
export const REMOVE_USER_FOLLOWING = 'REMOVE_USER_FOLLOWING';

export interface setAuthUserAction {
  type: typeof SET_AUTH_USER;
  payload: AuthUser;
}

export interface clearAuthUserAction {
  type: typeof CLEAR_AUTH_USER;
}

export interface setTokenAction {
  type: typeof SET_TOKEN;
  payload: string;
}

export interface setSocketAction {
  type: typeof SET_SOCKET;
  payload: Socket;
}

export interface openAuthPopupAction {
  type: typeof OPEN_AUTH_POPUP;
  payload: PopupType;
}

export interface closeAuthPopupAction {
  type: typeof CLOSE_AUTH_POPUP;
}

export interface addUserNotificationAction {
  type: typeof ADD_USER_NOTIFICATION;
  payload: any;
}

export interface removeUserNotificationAction {
  type: typeof REMOVE_USER_NOTIFICATION;
  payload: string;
}
export interface cleanUserNotificationsAction {
  type: typeof CLEAN_USER_NOTIFICATIONS;
}

export interface addUserImageAction {
  type: typeof ADD_USER_IMAGE;
  payload: any;
}

export interface addUserCoverAction {
  type: typeof ADD_USER_COVER;
  payload: any;
}

export interface addUserFollowingAction {
  type: typeof ADD_USER_FOLLOWING;
  payload: any;
}

export interface removeUserFollowingAction {
  type: typeof REMOVE_USER_FOLLOWING;
  payload: string;
}

export type AuthActionTypes =
  | setAuthUserAction
  | setTokenAction
  | clearAuthUserAction
  | openAuthPopupAction
  | closeAuthPopupAction
  | addUserNotificationAction
  | removeUserNotificationAction
  | cleanUserNotificationsAction
  | addUserFollowingAction
  | removeUserFollowingAction
  | setSocketAction
  | addUserImageAction
  | addUserCoverAction;

// Actions
export function setAuthUser(user: AuthUser): AuthActionTypes {
  return {
    type: SET_AUTH_USER,
    payload: user,
  };
}

export function setToken(token: string): AuthActionTypes {
  return {
    type: SET_TOKEN,
    payload: token,
  };
}

export function setSocket(socket: Socket): AuthActionTypes {
  return {
    type: SET_SOCKET,
    payload: socket,
  };
}

export function clearAuthUser(): AuthActionTypes {
  return {
    type: CLEAR_AUTH_USER,
  };
}

export function openAuthPopup(popupType: PopupType): AuthActionTypes {
  return {
    type: OPEN_AUTH_POPUP,
    payload: popupType,
  };
}

export function closeAuthPopup(): AuthActionTypes {
  return {
    type: CLOSE_AUTH_POPUP,
  };
}

export function addUserNotification(notification: any): AuthActionTypes {
  return {
    type: ADD_USER_NOTIFICATION,
    payload: notification,
  };
}

export function removeUserNotification(id: string): AuthActionTypes {
  return {
    type: REMOVE_USER_NOTIFICATION,
    payload: id,
  };
}

export function cleanUserNotifications(): AuthActionTypes {
  return {
    type: CLEAN_USER_NOTIFICATIONS,
  };
}

export function addUserImage({ image: image, imagePublicId: imagePublicId }): AuthActionTypes {
  return {
    type: ADD_USER_IMAGE,
    payload: { image, imagePublicId },
  };
}

export function addUserCover({ coverImage: coverImage, coverImagePublicId: coverImagePublicId }): AuthActionTypes {
  return {
    type: ADD_USER_COVER,
    payload: { coverImage, coverImagePublicId },
  };
}

export function addUserFollowing(follow: any): AuthActionTypes {
  return {
    type: ADD_USER_FOLLOWING,
    payload: follow,
  };
}

export function removeUserFollowing(id: string): AuthActionTypes {
  return {
    type: REMOVE_USER_FOLLOWING,
    payload: id,
  };
}

// Reducer
const initialState: AuthState = {
  user: null,
  token: null,
  socket: null,
  isPopupOpen: false,
  popupType: null,
};

export function authReducer(state = initialState, action: AuthActionTypes): AuthState {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case CLEAR_AUTH_USER:
      return {
        ...state,
        user: null,
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case OPEN_AUTH_POPUP:
      return {
        ...state,
        isPopupOpen: true,
        popupType: action.payload,
      };
    case CLOSE_AUTH_POPUP:
      return {
        ...state,
        isPopupOpen: false,
      };
    case ADD_USER_NOTIFICATION:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: [...state.user.notifications, action.payload],
        },
      };
    case REMOVE_USER_NOTIFICATION:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: state.user.notifications.filter((n: any) => n._id !== action.payload),
        },
      };
    case ADD_USER_FOLLOWING:
      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };
    case REMOVE_USER_FOLLOWING:
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter((f: any) => f._id !== action.payload),
        },
      };
    case CLEAN_USER_NOTIFICATIONS:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: [],
        },
      };
    case ADD_USER_IMAGE:
      return {
        ...state,
        user: {
          ...state.user,
          image: action.payload.image,
          imagePublicId: action.payload.imagePublicId,
        },
      };
    case ADD_USER_COVER:
      return {
        ...state,
        user: {
          ...state.user,
          coverImage: action.payload.coverImage,
          coverImagePublicId: action.payload.coverImagePublicId,
        },
      };
    default:
      return state;
  }
}
