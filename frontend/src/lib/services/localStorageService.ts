import OAuthToken from 'models/OAuthToken';

const TOKEN = 'TOKEN';

export const putTokenInLocalStorage = (token: OAuthToken): void => {
  const { localStorage } = window;
  localStorage.setItem(TOKEN, JSON.stringify(token));
};

export const getTokenFromLocalStorage = (): OAuthToken | null => {
  const { localStorage } = window;
  const token = localStorage.getItem(TOKEN);

  if (token) {
    return JSON.parse(token) as OAuthToken;
  }

  return null;
};

export const clearTokenFromLocalStorage = (): void => {
  const { localStorage } = window;
  localStorage.removeItem(TOKEN);
};
