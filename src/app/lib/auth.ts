// app/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { User as NextAuthUser, Session as NextAuthSession } from "next-auth"; // Import the missing types

interface CustomUser extends NextAuthUser {  // Extend the imported User type
  googleId?: string;
  id: string;
}

interface CustomJWT extends JWT {
  token?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    error: '/auth/error',
    signIn: "/signin", // Customize the sign-in page if necessary
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.sub = customUser.id;

        try {
          const response = await fetch('https://ai-assistant-caller.fly.dev/auth/google/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleId: customUser.id, email: customUser.email }),
          });

          const data = await response.json();
          if (response.ok) {
            token.token = data.token;
          }
        } catch (error) {
          console.error('Error saving user to backend:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
