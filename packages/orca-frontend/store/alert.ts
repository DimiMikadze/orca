export enum AlertTypes {
  Error = 'error',
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
}

export enum AlertAlignment {
  Top = 'top',
  Bottom = 'Bottom',
}

export const OPEN_ALERT = 'OPEN_ALERT';
export const CLOSE_ALERT = 'CLOSE_ALERT';

export interface Alert {
  message: string;
  type: AlertTypes;
  autoClose?: boolean;
  alignment?: AlertAlignment;
}

export interface OpenAlertAction {
  type: typeof OPEN_ALERT;
  payload: Alert;
}

export interface CloseAlertAction {
  type: typeof CLOSE_ALERT;
}

export type AlertActionTypes = OpenAlertAction | CloseAlertAction;

// Actions
export function openAlert(alert: Alert): AlertActionTypes {
  return {
    type: OPEN_ALERT,
    payload: alert,
  };
}

export function closeAlert(): AlertActionTypes {
  return {
    type: CLOSE_ALERT,
  };
}

// Reducer
const initialState: Alert = {
  message: null,
  type: AlertTypes.Success,
  autoClose: true,
  alignment: AlertAlignment.Top,
};

export function alertReducer(state = initialState, action: AlertActionTypes): Alert {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        ...action.payload,
      };
    case CLOSE_ALERT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
