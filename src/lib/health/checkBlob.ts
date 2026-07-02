import { list } from '@vercel/blob';
import { logger } from '@/lib/logger';
import type { HealthStatus } from './checkDatabase';

export async function checkBlob(): Promise<HealthStatus> {
  // Check if token is available
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return 'unconfigured';
  }
  
  try {
    // Attempt a lightweight list operation to verify connectivity
    await list({ limit: 1 });
    return 'ok';
  } catch (error) {
    logger.warn({ event: 'CLIENT_ERROR', component: 'BlobStorage', error }, 'Blob Storage health check failed (Degraded State)');
    return 'error';
  }
}
