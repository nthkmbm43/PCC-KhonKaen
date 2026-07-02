import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// SEC-003: Upstash Redis Rate Limiting (Fail-open)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const rateLimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 req/min for internal log API
      analytics: true,
    })
  : null;

export async function POST(req: Request) {
  try {
    // 1. Secret Authentication
    const authHeader = req.headers.get('x-internal-log-secret');
    if (!authHeader || authHeader !== process.env.LOG_INTERNAL_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate Limiting (Fail-open)
    if (rateLimit) {
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      try {
        const { success } = await rateLimit.limit(`ratelimit_log_${ip}`);
        if (!success) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
      } catch (err) {
        // Fail-open: allow request to proceed if Upstash is down
        console.error('Rate limit check failed (fail-open):', err);
      }
    }

    // 3. Log Processing
    const body = await req.json();
    const requestId = req.headers.get('x-request-id') || 'unknown';
    
    // Create a child logger with the provided request context
    const log = logger.child({
      requestId,
      event: 'CLIENT_ERROR',
      route: body.url || 'client',
    });

    log.error({
      message: body.message || 'Unhandled client exception',
      error: body, // will be normalized by StructuredLogger
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Failsafe logger if something goes wrong parsing the request
    logger.error({ event: 'CLIENT_ERROR', error }, 'Failed to process internal log request');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
