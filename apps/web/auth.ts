import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./lib/auth";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 1 hour
    updateAge: 0,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await login(credentials);
          if (!user)
            console.log(
              "AUTH.TS",
              "Login gagal, periksa kembali kredensial Anda"
            );

          return user;
        } catch (error) {
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

    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        // Update token with user data
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
          role: user.role,
          provider: user.provider,
          access_token: user.access_token,
        };
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        // Always set session from token data
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          imageUrl: token.imageUrl,
          role: token.role,
          provider: token.provider,
          access_token: token.access_token,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
});
