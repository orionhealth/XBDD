import { getTokenFromLocalStorage, putTokenInLocalStorage } from './LocalStorageService';
import { fetchRefreshedToken } from './FetchAuthToken';
import OAuthToken from 'models/OAuthToken';

export const getValidToken = async (): Promise<OAuthToken | void> => {
  const storedToken = getTokenFromLocalStorage();

  if (storedToken) {
    // Give ourselves 30 secs before it expires
    if (storedToken.expiresAt - 30000 > Date.now()) {
      return storedToken;
    } else {
      const newToken = await fetchRefreshedToken(storedToken);
      if (newToken) {
        putTokenInLocalStorage(newToken);
        return newToken;
      }
    }
  }
};
