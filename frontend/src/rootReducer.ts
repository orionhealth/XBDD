import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import xbddReducer from './xbddReducer';

const rootReducer = combineReducers({
  app: xbddReducer,
});

export type RootStore = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export type StoreDispatch = typeof store.dispatch;

export default store;
