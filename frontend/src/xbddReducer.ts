import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { User } from 'models/User';
import { putTokenInLocalStorage } from 'lib/services/LocalStorageService';
import { authenticateWithGithubCode } from 'lib/services/FetchAuthToken';
import { fetchLoggedInUser } from 'lib/services/FetchLoggedInUser';
import { StoreDispatch } from 'rootReducer';

interface UserState {
  user: User | null;
}

type UserAction = PayloadAction<User | null>;

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

export const loginWithGithub = (code: string) => async (dispatch: StoreDispatch): Promise<void> => {
  const token = await authenticateWithGithubCode(code);
  if (token) {
    putTokenInLocalStorage(token);
    const user = await fetchLoggedInUser();

    if (user) {
      dispatch(setUser(user));
    }
  }
};

export default reducer;
