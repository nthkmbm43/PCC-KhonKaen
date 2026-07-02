import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@/db';
import { admins } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
}) : null;

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (ratelimit) {
          const headersList = await headers();
          const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1';
          const { success } = await ratelimit.limit(`login_ratelimit_${ip}`);
          if (!success) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
        } else {
          console.warn('⚠️ Rate limiting is bypassed because UPSTASH_REDIS env vars are missing.');
        }

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

          // 2. Fallback to admins table in Database
          const userResult = await db.select().from(admins).where(eq(admins.email, username)).limit(1);
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
