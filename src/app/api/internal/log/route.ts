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
    // 1. Same-Origin / Host Verification (Security)
    // We do not use NEXT_PUBLIC_ secrets as they are exposed to the browser.
    // Instead, we verify that the request originates from our own application.
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    // In production, you would strictly match against process.env.NEXT_PUBLIC_APP_URL
    // For this CMS, we enforce that either origin matches host, or origin is omitted (same-origin policy)
    if (origin && host && !origin.includes(host)) {
      logger.warn({ event: 'CLIENT_ERROR', ip: req.headers.get('x-forwarded-for') ?? undefined }, 'Rejected log request from untrusted origin');
      return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
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
        logger.warn({ event: 'CLIENT_ERROR', error: err }, 'Upstash Rate limit check failed (fail-open mode active). Allowing log through.');
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
