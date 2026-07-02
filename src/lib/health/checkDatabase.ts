import { db } from "@/db";
import { sql } from "drizzle-orm";
import { logger } from "@/lib/logger";

export type HealthStatus = 'ok' | 'error' | 'unconfigured';

export async function checkDatabase(): Promise<HealthStatus> {
  try {
    // A simple, fast query to verify database connectivity and responsiveness
    await db.execute(sql`SELECT 1`);
    return 'ok';
  } catch (error) {
    logger.error({ event: 'SERVICE_CRASH', component: 'Database', error }, 'Database health check failed');
    return 'error';
  }
}
