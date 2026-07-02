import { NextResponse } from 'next/server';
import { getAppMetadata } from '@/lib/health/metadata';
import { checkDatabase } from '@/lib/health/checkDatabase';
import { checkRedis } from '@/lib/health/checkRedis';
import { checkBlob } from '@/lib/health/checkBlob';
import { logger } from '@/lib/logger';

export async function GET() {
  const metadata = getAppMetadata();
  
  // Run all dependency checks concurrently
  const [dbStatus, redisStatus, blobStatus] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkBlob(),
  ]);
  
  const checks = {
    database: dbStatus,
    redis: redisStatus,
    blob: blobStatus,
  };
  
  // Determine overall status based on Graceful Degradation policy
  let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';
  let httpStatus = 200;
  
  // Database is CRITICAL. If it fails, the readiness probe fails.
  if (dbStatus === 'error') {
    overallStatus = 'error';
    httpStatus = 503;
  } 
  // Redis and Blob Storage are OPTIONAL. If they fail, the system is degraded but still ready.
  else if (redisStatus === 'error' || blobStatus === 'error') {
    overallStatus = 'degraded';
    httpStatus = 200;
  }
  
  const responsePayload = {
    status: overallStatus,
    ...metadata,
    checks,
  };
  
  // Log critical failures for immediate alerting
  if (overallStatus === 'error') {
    logger.error({ event: 'SERVICE_CRASH', payload: responsePayload }, 'Readiness probe failed due to critical dependency outage');
  }

  return NextResponse.json(responsePayload, { status: httpStatus });
}
