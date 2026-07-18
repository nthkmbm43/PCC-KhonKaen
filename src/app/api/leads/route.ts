import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import { db } from '@/db';
import { leads } from '@/db/schema';

export const runtime = 'nodejs';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const rateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), analytics: true })
  : null;

const optionalText = (max: number) => z.string().trim().max(max).optional().default('');
const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30).regex(/^[0-9+()\-\s]+$/),
  email: z.union([z.literal(''), z.string().email().max(200)]).optional().default(''),
  project: optionalText(300),
  message: optionalText(3000),
  website: optionalText(200),
  attribution: z.object({
    landingPage: optionalText(1000),
    referrer: optionalText(1000),
    utmSource: optionalText(200),
    utmMedium: optionalText(200),
    utmCampaign: optionalText(200),
    utmContent: optionalText(200),
    utmTerm: optionalText(200),
    clickId: optionalText(300),
  }).optional(),
});

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ message: 'Invalid request origin' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimit) {
    const result = await rateLimit.limit(`lead_${ip}`);
    if (!result.success) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }
  }

  try {
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid lead details' }, { status: 400 });
    }

    const data = parsed.data;
    const attribution = data.attribution;
    if (data.website) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const [created] = await db.insert(leads).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      project: data.project || null,
      message: data.message || null,
      landingPage: attribution?.landingPage || null,
      referrer: attribution?.referrer || null,
      utmSource: attribution?.utmSource || null,
      utmMedium: attribution?.utmMedium || null,
      utmCampaign: attribution?.utmCampaign || null,
      utmContent: attribution?.utmContent || null,
      utmTerm: attribution?.utmTerm || null,
      clickId: attribution?.clickId || null,
      userAgent: request.headers.get('user-agent')?.slice(0, 1000) || null,
    }).returning({ id: leads.id });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error('Lead submission failed', error);
    return NextResponse.json({ message: 'Unable to save lead' }, { status: 500 });
  }
}
