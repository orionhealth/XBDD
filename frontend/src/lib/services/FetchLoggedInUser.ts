import { getValidToken } from './TokenService';
import { Method, doRequest } from 'lib/rest/RestRequests';
import FetchLoggedInUserTypes from './generated/FetchLoggedInUserTypes';
import { LoggedInUser } from 'models/User';

interface ResponseData {
  user_id: string;
  display: string;
  socialLogin: string;
  loginType: string;
  favourites?: any;
}

export const getAvatarUrl = (loginType: string, socialLogin: string): string | undefined => {
  if (loginType === 'GITHUB') {
    return `https://github.com/${socialLogin}.png`;
  }
};

/* eslint-disable @typescript-eslint/camelcase */
const createUser = ({ user_id, display, socialLogin, loginType, favourites }: ResponseData): LoggedInUser => ({
  userId: user_id,
  display,
  socialLogin,
  avatarUrl: getAvatarUrl(loginType, socialLogin),
  favourites,
});

export const fetchLoggedInUser = async (): Promise<LoggedInUser | void> => {
  const path = `/rest/user/loggedin`;
  const token = await getValidToken();
  if (token) {
    return doRequest(Method.GET, path, 'rest.error.get', null, token, FetchLoggedInUserTypes, createUser);
  }
};
