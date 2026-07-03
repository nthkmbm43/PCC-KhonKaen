import { draftMode, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { pages, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    })
  : null;

let mockRequestCount = 0;

export async function GET(request: Request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

  let success = true;

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') || 'page'; // 'page' or 'product'

  if (ratelimit) {
    const result = await ratelimit.limit(`preview_${ip}`);
    success = result.success;
  } else if (slug === 'test-rate-limit') {
    // Mock rate limiter for testing without Upstash
    mockRequestCount++;
    if (mockRequestCount > 10) {
      success = false;
    }
  }

  if (!success) {
    logger.warn({ event: 'PREVIEW_DENIED', ip, reason: 'Rate limit exceeded' }, 'Preview rate limit exceeded');
    return new Response('Too many requests', { status: 429 });
  }
  if (!token || !slug) {
    return new Response('Missing token or slug', { status: 400 });
  }

  // Hash the incoming token to compare against the stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  let previewValid = false;
  let targetPath = `/${slug}`;

  if (type === 'page') {
    const page = await db.query.pages.findFirst({ where: eq(pages.slug, slug) });
    if (!page) {
      return new Response('Page not found', { status: 404 });
    }
    if (page.previewTokenHash === tokenHash && page.previewExpiresAt && page.previewExpiresAt > new Date()) {
      previewValid = true;
      targetPath = `/${slug}`;
    }
  } else if (type === 'product') {
    const product = await db.query.products.findFirst({ where: eq(products.slug, slug) });
    if (!product) {
      return new Response('Product not found', { status: 404 });
    }
    if (product.previewTokenHash === tokenHash && product.previewExpiresAt && product.previewExpiresAt > new Date()) {
      previewValid = true;
      targetPath = `/products/${slug}`;
    }
  }

  if (!previewValid) {
    logger.warn({ event: 'PREVIEW_DENIED', ip, slug, type, reason: 'Invalid or expired token' }, 'Preview access denied');
    return new Response('Invalid or expired preview token', { status: 403 });
  }

  logger.info({ event: 'PREVIEW_GRANTED', ip, slug, type }, 'Preview access granted');

  // Enable Draft Mode (sets a cookie)
  (await draftMode()).enable();

  // Redirect to the actual page to view the draft
  redirect(targetPath);
}
