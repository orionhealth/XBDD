export interface User {
  userId: string;
  socialLogin?: string;
  display: string;
  avatarUrl?: string;
  favourites?: Record<string, boolean>;
}
