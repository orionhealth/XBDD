const USER = 'USER';
const USER_TIME = 'USER_TIME';

export const putUserInLocalStorage = (user: string, timeAcquired: number): void => {
  const { localStorage } = window;
  localStorage.setItem(USER, user);
  localStorage.setItem(USER_TIME, JSON.stringify(timeAcquired));
};

export const getUserFromLocalStorage = (): string | null => {
  const { localStorage } = window;
  const user = localStorage.getItem(USER);
  const timeSaved = localStorage.getItem(USER_TIME);

  if (user && timeSaved) {
    const timeValid = 21 * 24 * 60 * 60 * 1000;
    const timeAlive = Date.now() - Number.parseInt(timeSaved);
    if (timeAlive < timeValid) {
      return user;
    }
  }

  return null;
};

export const clearUserFromLocalStorage = (): void => {
  const { localStorage } = window;
  localStorage.removeItem(USER);
  localStorage.removeItem(USER_TIME);
};
