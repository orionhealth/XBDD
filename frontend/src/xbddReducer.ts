import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { getUserFromLocalStorage, putUserInLocalStorage, clearUserFromLocalStorage } from 'lib/services/localStorageService';

interface UserState {
  user: string | null;
}

type UserAction = PayloadAction<{ user: string; remember: boolean } | null>;

type XbddState = UserState;

const getInitialState = (): XbddState => ({
  user: getUserFromLocalStorage(),
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

const { actions, reducer } = createSlice({
  name: 'xbdd',
  initialState: getInitialState(),
  reducers: {
    setUser: userReducer,
  },
});

export const { setUser } = actions;

export default reducer;
