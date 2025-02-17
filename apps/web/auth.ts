/* eslint-disable turbo/no-undeclared-env-vars */
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login, refreshToken } from "./lib/auth";
import { jwtDecode } from "jwt-decode";
import GoogleProvider from "next-auth/providers/google";
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        domain: process.env.AUTH_DOMAIN as string,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await login(credentials);

          return user;
        } catch (error) {
          console.timeEnd("Login Request");
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email_verified || false;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        const { access_token, refresh_token } = user;
        return { access_token, refresh_token };
      } else if (token?.refresh_token || trigger == "update") {
        const newToken = await refreshToken();
        console.log(newToken);
        return newToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.access_token) {
        const user = jwtDecode(token.access_token!) as User;
        session.user.id = user.id as string;
        session.user.email = user.email as string;
        session.user.name = user.name as string;
        session.user.imageUrl = user.imageUrl as string;
        session.user.role = user.role as string;
        session.user.access_token = token.access_token as string;
        session.user.organizerId = user.organizerId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
});
