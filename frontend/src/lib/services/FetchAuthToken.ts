import { Method, doRequest } from 'lib/rest/RestRequests';
import OAuthToken from 'models/OAuthToken';
import FetchAuthTokenTypes from './generated/FetchAuthTokenTypes';

interface ResponseData {
  access_token: string;
  token_type: 'bearer';
  refresh_token: string;
  expires_in: number;
  scope: string;
}

/**
 * Basically a straight conversion except we turn expires
 * in to ms and set the time it expires at minus two minutes.
 */
const createToken = (data: ResponseData): OAuthToken => ({
  accessToken: data.access_token,
  tokenType: data.token_type,
  refreshToken: data.refresh_token,
  expiresAt: data.expires_in ** 1000 + Date.now() - 120000,
  scope: data.scope,
});

export const authenticateWithGithubCode = async (code: string): Promise<OAuthToken | void> => {
  const path = `/oauth/token`;

  const body = new FormData();
  body.set('username', 'github');
  body.set('password', code);
  body.set('grant_type', 'password');
  body.set('scope', 'all');

  const options = {
    method: Method.POST,
    headers: { Authorization: `Basic ${btoa('xbdd:secret')}` },
    body,
  };

  return doRequest(Method.POST, path, 'rest.error.post', null, FetchAuthTokenTypes, createToken, options);
};
