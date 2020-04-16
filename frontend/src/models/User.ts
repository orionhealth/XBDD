export interface User {
  userId: string;
  socialLogin: string;
  display: string;
  avatarUrl?: string;
}

export interface LoggedInUser extends User {
  favourites?: Record<string, boolean>;
}
