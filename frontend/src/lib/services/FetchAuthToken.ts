import { Method, doTokenRequest } from 'lib/rest/RestRequests';
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
const createToken = (data: ResponseData): OAuthToken => {
  const expiresAt = data.expires_in * 1000 + Date.now();
  console.debug(`Token expires at ${expiresAt}`);
  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
    expiresAt,
    scope: data.scope,
  };
};

export const authenticateWithGithubCode = async (code: string): Promise<OAuthToken | void> => {
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

  return doTokenRequest(options, `rest.error.token`, FetchAuthTokenTypes, createToken);
};

export const fetchRefreshedToken = (token: OAuthToken): Promise<OAuthToken | void> => {
  const body = new FormData();
  body.set('refresh_token', token.refreshToken);
  body.set('grant_type', 'refresh_token');
  body.set('scope', token.scope);

  const options = {
    method: Method.POST,
    headers: { Authorization: `Basic ${btoa(`${process.env.REACT_APP_XBDD_CLIENT_ID}:${process.env.REACT_APP_XBDD_CLIENT_SECRET}`)}` },
    body,
  };

  return doTokenRequest(options, `rest.error.refreshToken`, FetchAuthTokenTypes, createToken);
};
