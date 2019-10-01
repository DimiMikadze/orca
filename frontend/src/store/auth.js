/**
 * Actions types
 */
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const CLEAR_AUTH_USER = 'CLEAR_AUTH_USER';

/**
 * Initial State
 */
export const authInitialState = {
  user: null,
};

/**
 * User Reducer
 */
export const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_AUTH_USER: {
      return {
        ...state,
        ...authInitialState,
      };
    }

    default:
      return state;
  }
};
