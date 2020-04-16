import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { getValidToken } from './lib/services/TokenService';
import { LoggedInUser } from 'models/User';
import { putTokenInLocalStorage } from 'lib/services/LocalStorageService';
import { authenticateWithGithubCode } from 'lib/services/FetchAuthToken';
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

const fetchAndSaveUser = async (dispatch: StoreDispatch): Promise<void> => {
  const user = await fetchLoggedInUser();

  if (user) {
    dispatch(setUser(user));
  }
};

export const getUserIfTokenIsValid = () => async (dispatch: StoreDispatch): Promise<void> => {
  const token = await getValidToken();
  if (token) {
    fetchAndSaveUser(dispatch);
  }
};

export const loginWithGithub = (code: string) => async (dispatch: StoreDispatch): Promise<void> => {
  const token = await authenticateWithGithubCode(code);
  if (token) {
    putTokenInLocalStorage(token);
    fetchAndSaveUser(dispatch);
  }
};

export default reducer;
