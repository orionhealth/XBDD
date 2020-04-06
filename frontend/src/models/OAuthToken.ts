interface OAuthToken {
  accessToken: string;
  tokenType: 'bearer';
  refreshToken: string;
  expiresAt: number;
  scope: string;
}

export default OAuthToken;
