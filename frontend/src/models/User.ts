export type UserName = string;

export interface User {
  userId: string;
  avatarUrl?: string;
  name?: UserName;
}

export interface LoggedInUser extends User {
  email?: string;
  socialLogin: string;
  loginType: string;
  favourites?: Record<string, boolean>;
}
