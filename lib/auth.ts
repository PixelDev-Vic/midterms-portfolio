import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Only allow the email(s) listed in ADMIN_EMAIL env var
    async signIn({ user }) {
      const allowedEmails = (process.env.ADMIN_EMAIL ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase());
      return allowedEmails.includes((user.email ?? "").toLowerCase());
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
