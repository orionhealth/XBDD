import { createSlice } from "@reduxjs/toolkit";

const userReducer = (state, action) => ({ ...state, user: action.payload });
const productReducer = (state, action) => ({ ...state, product: action.payload });
const versionReducer = (state, action) => ({ ...state, user: action.payload });
const buildReducer = (state, action) => ({ ...state, build: action.payload });

const initialState = {
  user: null,
  product: null,
  version: null,
  build: null,
};

const { actions, reducer } = createSlice({
  name: "xbdd",
  initialState,
  reducers: {
    setUser: userReducer,
    setProduct: productReducer,
    setVersion: versionReducer,
    setBuild: buildReducer,
  },
});

export const { setUser, setProduct, setVersion, setBuild } = actions;

export default reducer;
