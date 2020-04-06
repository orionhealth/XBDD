import { putTokenInLocalStorage } from './LocalStorageService';
import { authenticateWithGithubCode } from './FetchAuthToken';

export const loginWithGithub = async (code: string): Promise<void> => {
  const token = await authenticateWithGithubCode(code);

  if (token) {
    putTokenInLocalStorage(token);
  }
};
