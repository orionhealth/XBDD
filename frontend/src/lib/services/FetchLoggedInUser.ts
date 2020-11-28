import { Method, doRequest } from 'lib/rest/RestRequests';
import FetchLoggedInUserTypes from './generated/FetchLoggedInUserTypes';
import { User } from 'models/User';
import { getEncodedURI } from 'lib/rest/URIHelper';

interface ResponseData {
  user_id: string;
  display: string;
  loginType: string;
  socialLogin?: string;
  favourites?: Record<string, boolean>;
}

export const getAvatarUrl = (loginType: string, socialLogin?: string): string | undefined => {
  if (socialLogin && loginType === 'GITHUB') {
    return `https://github.com/${getEncodedURI(socialLogin)}.png`;
  }
};

const createUser = (responseData: ResponseData): User => ({
  userId: responseData.user_id,
  display: responseData.display,
  socialLogin: responseData.socialLogin,
  avatarUrl: getAvatarUrl(responseData.loginType, responseData.socialLogin),
  favourites: responseData.favourites,
});

export const fetchLoggedInUser = async (): Promise<User | void> => {
  const url = `/rest/user/loggedin`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchLoggedInUserTypes, createUser);
};
