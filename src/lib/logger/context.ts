import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  traceId?: string;
  spanId?: string;
}

/**
 * AsyncLocalStorage provides a way to trace execution contexts through asynchronous operations.
 * This ensures that logs deep within the application stack can automatically append the current request's correlation ID
 * without requiring it to be explicitly passed through every function call.
 */
export const loggerContext = new AsyncLocalStorage<RequestContext>();
