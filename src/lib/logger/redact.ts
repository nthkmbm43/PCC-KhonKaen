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
export function redact(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redact(item));
  }

  if (typeof obj === 'object') {
    const redactedObj: Record<string, unknown> = {};
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      if (REDACT_KEYS.has(key.toLowerCase())) {
        redactedObj[key] = '***MASKED***';
      } else {
        redactedObj[key] = redact(record[key]);
      }
    }
    return redactedObj;
  }

  return obj;
}
