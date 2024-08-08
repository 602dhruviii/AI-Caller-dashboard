import { DefaultUser, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string; // Add the id property
    googleId?: string; // Add googleId property
  }

  interface Session extends DefaultSession {
    user: {
      id: string; // Add the id property
      token: string; // Add token property
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token?: string; // Add token property
  }
}
