import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { LoggedInUser } from 'models/User';
import { fetchLoggedInUser } from 'lib/services/FetchLoggedInUser';
import { StoreDispatch } from 'rootReducer';

type UserState = LoggedInUser | null;

type UserAction = PayloadAction<UserState>;

const userReducer: CaseReducer<UserState, UserAction> = (state, action) => {
  return action.payload;
};

const { actions, reducer } = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {
    setUser: userReducer,
  },
});

export const { setUser } = actions;

export const fetchUser = () => async (dispatch: StoreDispatch): Promise<void> => {
  const user = await fetchLoggedInUser();
  if (user) {
    dispatch(setUser(user));
  }
};

export default reducer;
