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
const createUser = (responseData: ResponseData): LoggedInUser => ({
  userId: responseData.user_id,
  display: responseData.display,
  socialLogin: responseData.socialLogin,
  avatarUrl: getAvatarUrl(responseData.loginType, responseData.socialLogin),
  favourites: responseData.favourites,
});

export const fetchLoggedInUser = async (): Promise<LoggedInUser | void> => {
  const url = `/rest/user/loggedin`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchLoggedInUserTypes, createUser);
};
