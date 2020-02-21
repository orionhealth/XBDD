import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface UserState {
  user: string | null;
}

interface ProductVersionBuildState {
  product: string | null;
  version: string | null;
  build: string | null;
}

type UserAction = PayloadAction<string | null>;
type ProductVersionBuildAction = PayloadAction<ProductVersionBuildState | null>;

type XbddState = ProductVersionBuildState & UserState;

const userReducer: CaseReducer<XbddState, UserAction> = (state, action) => ({ ...state, user: action.payload });
const selectProductBuildAndVersionReducer: CaseReducer<XbddState, ProductVersionBuildAction> = (state, action) => {
  if (action.payload) {
    const { product, version, build } = action.payload;
    return { ...state, product, version, build };
  }

  return { ...state, product: null, version: null, build: null };
};

const initialState: XbddState = {
  user: null,
  product: null,
  version: null,
  build: null,
};

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState,
  reducers: {
    setUser: userReducer,
    selectProductBuildAndVersion: selectProductBuildAndVersionReducer,
  },
});

export const { setUser, selectProductBuildAndVersion } = actions;

export default reducer;
