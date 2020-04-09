import { getValidToken } from './TokenService';
import { Method, doRequest } from 'lib/rest/RestRequests';
import FetchLoggedInUserTypes from './generated/FetchLoggedInUserTypes';
import { User } from 'models/User';

interface ResponseData {
  user_id: string;
  email: string;
  avatarUrl: string;
  name: string;
  socialLogin: string;
  loginType: string;
  favourites: any;
}

/* eslint-disable @typescript-eslint/camelcase */
const createUser = ({ user_id, email, avatarUrl, name, socialLogin, loginType, favourites }: ResponseData): User => ({
  userId: user_id,
  email,
  avatarUrl,
  name,
  socialLogin,
  loginType,
  favourites,
});

export const fetchLoggedInUser = async (): Promise<User | void> => {
  const path = `/rest/user/loggedin`;
  const token = await getValidToken();
  if (token) {
    return doRequest(Method.GET, path, 'rest.error.get', null, token, FetchLoggedInUserTypes, createUser);
  }
};
