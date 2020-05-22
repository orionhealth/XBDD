import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './redux/UserReducer';
import tagsMetadataReducer from 'redux/TagsMetadataReducer';
import featureIndexReducer from 'redux/FeatureIndexReducer';

const rootReducer = combineReducers({
  user: userReducer,
  featureIndex: featureIndexReducer,
  tags: tagsMetadataReducer,
});

export type RootStore = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export type StoreDispatch = typeof store.dispatch;

export const { dispatch } = store;

export default store;
