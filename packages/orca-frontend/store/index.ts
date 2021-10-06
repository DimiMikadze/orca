import { createStore, combineReducers } from 'redux';
import { authReducer } from './auth';
import { alertReducer } from './alert';
import { settingsReducer } from './settings';

const rootReducer = combineReducers({
  auth: authReducer,
  notification: alertReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const isServer = typeof window === 'undefined';
const extension = isServer
  ? {}
  : (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

export const store = createStore(rootReducer, extension);
