import { Method, doRequest } from 'lib/rest/RestRequests';
import FetchLoggedInUserTypes from './generated/FetchLoggedInUserTypes';
import { LoggedInUser } from 'models/User';
import { getEncodedURI } from 'lib/rest/URIHelper';

interface ResponseData {
  user_id: string;
  display: string;
  socialLogin?: string;
  loginType: string;
  favourites?: any;
}

export const getAvatarUrl = (loginType: string, socialLogin?: string): string | undefined => {
  if (socialLogin && loginType === 'GITHUB') {
    return `https://github.com/${getEncodedURI(socialLogin)}.png`;
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
  const url = `/rest/user/loggedin`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchLoggedInUserTypes, createUser);
};
