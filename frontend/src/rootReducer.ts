import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import featureReducer from 'redux/FeatureReducer';
import tagsMetadataReducer from 'redux/TagsMetadataReducer';
import userReducer from './redux/UserReducer';

const rootReducer = combineReducers({
  feature: featureReducer,
  tags: tagsMetadataReducer,
  user: userReducer,
});

export type RootStore = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export type StoreDispatch = typeof store.dispatch;

export const { dispatch } = store;

export default store;
