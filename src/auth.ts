import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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
          
          // 1. Check Master Admin from .env
          const envUser = process.env.ADMIN_USERNAME;
          const envPass = process.env.ADMIN_PASSWORD;

          if (envUser && envPass && username === envUser && password === envPass) {
             return { id: "master_admin", name: "Master Admin", email: username, role: "superuser" };
          }

          // 2. Check Database for Team Members
          const userResult = await db.select().from(users).where(eq(users.email, username)).limit(1);
          const dbUser = userResult[0];

          if (dbUser) {
            const passwordMatch = await bcrypt.compare(password, dbUser.password);
            if (passwordMatch) {
              return { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role };
            }
          }
        }
 
        return null;
      },
    }),
  ],
});
