"use server";

/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { api } from "./api";

export const login = async (credentials: Partial<Record<string, unknown>>) => {
  try {
    const res = await api("/auth", "POST", {
      body: credentials,
      contentType: "application/json",
    });

    return {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    };
  } catch (error: any) {
    if (error instanceof Error) console.log(error);
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const refreshToken = async () => {
  try {
    const cookie = cookies();
    const ftoken = (await cookie).get("next-auth.session-token")?.value;
    const { refresh_token } = (await decode({
      token: String(ftoken),
      secret: process.env.AUTH_SECRET as string,
      salt: "next-auth.session-token",
    })) as { refresh_token: string };

    const res = await api("/auth/token", "POST", {}, refresh_token);
    console.log("REFRESH_TOKEN:", res.data);
    return {
      access_token: res.data.access_token as string,
      refresh_token: res.data.refresh_token as string,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token.");
  }
};
