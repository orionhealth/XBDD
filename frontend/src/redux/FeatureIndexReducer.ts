import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { StoreDispatch } from 'rootReducer';
import Tag from 'models/Tag';
import SimpleFeature from 'models/SimpleFeature';
import fetchSimpleFeaturesByTags from 'lib/services/FetchSimpleFeaturesByTags';
import fetchSimpleFeatures from 'lib/services/FetchSimpleFeatures';

type FeatureIndexState = {
  byTag: Tag[] | null;
  byId: SimpleFeature[] | null;
};

type SaveIndexesAction = PayloadAction<FeatureIndexState>;

const featureIndexReducer: CaseReducer<FeatureIndexState, SaveIndexesAction> = (state, action) => {
  return action.payload;
};

const initialState: FeatureIndexState = {
  byTag: null,
  byId: null,
};

const { actions, reducer } = createSlice({
  name: 'featureIndex',
  initialState,
  reducers: {
    saveIndexes: featureIndexReducer,
  },
});

export const { saveIndexes } = actions;

export const fetchIndexes = (productId: string, versionString: string, build: string) => async (dispatch: StoreDispatch): Promise<void> => {
  const [byTag, byId] = await Promise.all([
    fetchSimpleFeaturesByTags(productId, versionString, build),
    fetchSimpleFeatures(productId, versionString, build),
  ]);

  dispatch(saveIndexes({ byId: byId || null, byTag: byTag || null }));
};

export default reducer;
