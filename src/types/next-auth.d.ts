import { DefaultSession, DefaultUser } from "next-auth";
import { UserClient } from "./user.types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: UserClient & DefaultSession["user"];
  }

  interface User extends DefaultUser, UserClient {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    photo?: string;
    nickname?: string;
    firstName: string;
    lastName: string;
    role: {
      id: string; // Cambiado de number a string
      code: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: UserClient;
  }
}
