export interface User {
  userId: string;
  display: string;
  socialLogin?: string;
  avatarUrl?: string;
  favourites?: Record<string, boolean>;
}
