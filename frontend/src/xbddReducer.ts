import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { getUserFromLocalStorage, putUserInLocalStorage, clearUserFromLocalStorage } from 'lib/services/localStorageService';

interface UserState {
  user: string | null;
}

interface ProductVersionBuildState {
  product: string | null;
  version: string | null;
  build: string | null;
}

type UserAction = PayloadAction<{ user: string; remember: boolean } | null>;
type ProductVersionBuildAction = PayloadAction<ProductVersionBuildState | null>;

type XbddState = ProductVersionBuildState & UserState;

const getInitialState = (): XbddState => ({
  user: getUserFromLocalStorage(),
  product: null,
  version: null,
  build: null,
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

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState: getInitialState(),
  reducers: {
    setUser: userReducer,
    selectProductBuildAndVersion: selectProductBuildAndVersionReducer,
  },
});

export const { setUser, selectProductBuildAndVersion } = actions;

export default reducer;
