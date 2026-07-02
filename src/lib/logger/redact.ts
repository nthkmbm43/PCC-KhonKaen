const REDACT_KEYS = new Set([
  'password',
  'accesstoken',
  'refreshtoken',
  'secret',
  'authorization',
  'cookie',
  'set-cookie',
  'apikey',
  'x-api-key'
]);

/**
 * Recursively masks sensitive fields in an object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function redact(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redact(item));
  }

  if (typeof obj === 'object') {
    const redactedObj: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      if (REDACT_KEYS.has(key.toLowerCase())) {
        redactedObj[key] = '***MASKED***';
      } else {
        redactedObj[key] = redact(obj[key]);
      }
    }
    return redactedObj;
  }

  return obj;
}
