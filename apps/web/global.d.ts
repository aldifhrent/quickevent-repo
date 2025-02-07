/* eslint-disable @typescript-eslint/no-unused-vars */
/** @format */
declare module "next-auth" {
  interface User {
    id?: string | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    imageUrl?: string | null | undefined;
    provider?: string | null | undefined;
    access_token?: string | undefined;
    role?: string | undefined;
  }
  interface Session {
    user: User;
  }
}
import { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  export interface JWT {
    id?: string | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    imageUrl?: string | null | undefined;
    provider?: string | null | undefined;
    access_token?: string | undefined;
    role?: string | undefined;
  }
}
