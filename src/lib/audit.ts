import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { headers } from "next/headers";
import { Session } from "next-auth";
import { logger } from "./logger";

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'DEPLOY' | 'UPLOAD' | 'SEARCH' | 'ROLLBACK' | 'GENERATE';
export type AuditResource = 'product' | 'page' | 'user' | 'setting' | 'upload' | 'richmenu' | 'deploy' | 'media' | 'seo' | 'revision';

interface LogAuditParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx?: any; // To support Drizzle transaction object
  session: Session | null;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeState?: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterState?: Record<string, any> | null;
  requestId?: string;
}

const SENSITIVE_FIELDS = ['password', 'accessToken', 'refreshToken', 'secret', 'apiKey'];
const IGNORED_FIELDS = ['createdAt', 'updatedAt', 'created_at', 'updated_at'];

/**
 * Filter and mask state data before saving to audit log.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeState(state?: Record<string, any> | null): Record<string, any> | null {
  if (!state) return null;
  
  const sanitized = { ...state };
  
  // Remove ignored fields
  IGNORED_FIELDS.forEach(field => {
    delete sanitized[field];
  });
  
  // Mask sensitive fields
  SENSITIVE_FIELDS.forEach(field => {
    if (field in sanitized && sanitized[field] !== undefined && sanitized[field] !== null) {
      sanitized[field] = '***MASKED***';
    }
  });
  
  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Logs an audit event synchronously.
 * Must be awaited to ensure the log is recorded before returning an API response.
 */
export async function logAudit({
  tx,
  session,
  action,
  resource,
  resourceId,
  beforeState,
  afterState,
  requestId
}: LogAuditParams) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';
    // Use passed requestId, or fallback to header if we implement request-id middleware, or generate one
    const finalRequestId = requestId || headersList.get('x-request-id') || crypto.randomUUID();

    const sanitizedBefore = sanitizeState(beforeState);
    const sanitizedAfter = sanitizeState(afterState);

    const logEntry = {
      userId: session?.user?.id || 'system',
      action,
      resource,
      resourceId,
      beforeState: sanitizedBefore,
      afterState: sanitizedAfter,
      ipAddress,
      userAgent,
      requestId: finalRequestId,
    };

    // Use transaction context if provided, otherwise use standard db instance
    const dbContext = tx || db;
    
    await dbContext.insert(auditLogs).values(logEntry);
  } catch (error) {
    // Policy B: CMS Business Continuity over Audit Strictness.
    // We log the audit failure to the Application Error Log but DO NOT throw,
    // ensuring the parent transaction (Business Logic) can still commit successfully.
    logger.error({ event: 'AUDIT_FAILURE', error }, 'Failed to insert audit log. Policy B enforced (allowing business transaction to proceed)');
  }
}
