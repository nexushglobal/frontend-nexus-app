export interface Profile {
  user: UserClient;
  accessToken: string;
  refreshToken: string;
}
export interface UserClient {
  id: string;
  email: string;
  photo?: string;
  nickname?: string;
  firstName: string;
  lastName: string;
  role: Role;
}
export interface Role {
  id: number;
  code: string;
  name: string;
}
