import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface UserState {
  user: string | null;
}

type UserAction = PayloadAction<{ user: string } | null>;

type XbddState = UserState;

const initialState: XbddState = {
  user: null,
};

const userReducer: CaseReducer<XbddState, UserAction> = (state, action) => {
  if (action.payload) {
    const { user } = action.payload;
    state.user = user;
  }
};

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState,
  reducers: {
    setUser: userReducer,
  },
});

export const { setUser } = actions;

export default reducer;
