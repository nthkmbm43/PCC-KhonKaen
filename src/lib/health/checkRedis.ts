import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';
import type { HealthStatus } from './checkDatabase';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function checkRedis(): Promise<HealthStatus> {
  if (!redis) return 'unconfigured';
  
  try {
    // Ping Upstash to check if it's responsive
    await redis.get('health-check-probe');
    return 'ok';
  } catch (error) {
    logger.warn({ event: 'CLIENT_ERROR', component: 'Redis', error }, 'Redis health check failed (Degraded State)');
    return 'error';
  }
}
