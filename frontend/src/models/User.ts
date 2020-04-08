export type UserName = string;

export interface User {
  userId: string;
  email?: string;
  avatarUrl?: string;
  name?: UserName;
  socialLogin: string;
  loginType: string;
  favourites?: Record<string, boolean>;
}
