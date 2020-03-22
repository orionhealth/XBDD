import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { getUserFromLocalStorage, putUserInLocalStorage, clearUserFromLocalStorage } from 'lib/services/localStorageService';
import { TagName } from 'models/Tag';
import TagsIgnored from 'models/TagsIgnored';

interface UserState {
  user: string | null;
}

interface ProductVersionBuildState {
  product: string | null;
  version: string | null;
  build: string | null;
}

interface FetchedDataState {
  tagsIgnored: TagsIgnored;
}

type UserAction = PayloadAction<{ user: string; remember: boolean } | null>;
type ProductVersionBuildAction = PayloadAction<ProductVersionBuildState | null>;
type ReceivedTagsIgnoredAction = PayloadAction<TagsIgnored>;
type TagIgnoreToggledAction = PayloadAction<TagName>;

type XbddState = ProductVersionBuildState & UserState & FetchedDataState;

const getInitialState = (): XbddState => ({
  user: getUserFromLocalStorage(),
  product: null,
  version: null,
  build: null,
  tagsIgnored: {} as Record<TagName, boolean>,
});

const userReducer: CaseReducer<XbddState, UserAction> = (state, action) => {
  clearUserFromLocalStorage();

  if (action.payload) {
    const { user, remember } = action.payload;
    state.user = user;
    if (remember) {
      putUserInLocalStorage(state.user, Date.now());
    }
  } else {
    return { ...getInitialState(), user: null };
  }
};

const selectProductBuildAndVersionReducer: CaseReducer<XbddState, ProductVersionBuildAction> = (state, action) => {
  if (action.payload) {
    const { product, version, build } = action.payload;
    return { ...state, product, version, build };
  }

  return { ...state, product: null, version: null, build: null };
};

const setTagsIgnored: CaseReducer<XbddState, ReceivedTagsIgnoredAction> = (state, action) => {
  return {
    ...state,
    tagsIgnored: action.payload,
  };
};

const toggleTagIgnore: CaseReducer<XbddState, TagIgnoreToggledAction> = (state, action) => {
  const tagName = action.payload;
  state.tagsIgnored[tagName] = !state.tagsIgnored[tagName];
  return state;
};

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState: getInitialState(),
  reducers: {
    setUser: userReducer,
    selectProductBuildAndVersion: selectProductBuildAndVersionReducer,
    receivedTagsIgnored: setTagsIgnored,
    tagIgnoreToggled: toggleTagIgnore,
  },
});

export const { setUser, selectProductBuildAndVersion, receivedTagsIgnored, tagIgnoreToggled } = actions;

export default reducer;
