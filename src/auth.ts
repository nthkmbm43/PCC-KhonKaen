import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string() })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const envUser = process.env.ADMIN_USERNAME;
          const envPass = process.env.ADMIN_PASSWORD;

          if (envUser && envPass && username === envUser && password === envPass) {
             return { id: "admin", name: "Admin", email: username };
          }
        }
 
        return null;
      },
    }),
  ],
});
