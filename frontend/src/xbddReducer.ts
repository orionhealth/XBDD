import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { LoggedInUser } from 'models/User';
import { fetchLoggedInUser } from 'lib/services/FetchLoggedInUser';
import { StoreDispatch } from 'rootReducer';

interface UserState {
  user: LoggedInUser | null;
}

type UserAction = PayloadAction<LoggedInUser | null>;

type XbddState = UserState;

const initialState: XbddState = {
  user: null,
};

const userReducer: CaseReducer<XbddState, UserAction> = (state, action) => {
  state.user = action.payload;
};

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState,
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
