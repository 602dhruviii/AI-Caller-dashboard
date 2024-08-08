import NextAuth, { NextAuthOptions, User as NextAuthUser, Session as NextAuthSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

interface CustomUser extends NextAuthUser {
  googleId?: string;
  id: string; // Ensure id is mandatory and always a string
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.sub = customUser.id;

        // Make a request to your backend to save the user data
        try {
          const response = await fetch('https://ai-assistant-caller.fly.dev/auth/google/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleId: customUser.id, email: customUser.email }),
          });

          const data = await response.json();
          if (response.ok) {
            (token as CustomJWT).token = data.token; // Use type assertion
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
        session.user.token = (token as CustomJWT).token as string; // Use type assertion
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/Callerboard';
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
