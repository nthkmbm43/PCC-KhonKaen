import { loggerContext, RequestContext } from './context';
import { LogEventName } from './events';
import { redact } from './redact';
import { defaultTransport, LoggerTransport, LogLevel, LogOutput } from './transport';

export interface LogParams extends RequestContext {
  event?: LogEventName;
  message?: string;
  error?: unknown;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export class StructuredLogger {
  private baseContext: Partial<LogParams>;
  private transport: LoggerTransport;
  private readonly schemaVersion = 1;
  private readonly service = 'pcc-cms';

  constructor(context: Partial<LogParams> = {}, transport: LoggerTransport = defaultTransport) {
    this.baseContext = context;
    this.transport = transport;
  }

  /**
   * Returns a new, immutable logger instance with merged context.
   */
  public child(context: Partial<LogParams>): StructuredLogger {
    return new StructuredLogger({ ...this.baseContext, ...context }, this.transport);
  }

  private normalizeError(error: unknown): unknown {
    if (!error) return undefined;
    
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      const normalized = {
        type: err.name || err.type || 'Error',
        name: err.name || 'Error',
        message: err.message || String(error),
        code: err.code || err.statusCode,
        digest: err.digest,
      };

      if (process.env.NODE_ENV !== 'production' && err.stack) {
        (normalized as Record<string, unknown>).stack = err.stack;
      }

      return normalized;
    }
    return { type: 'Error', name: 'Error', message: String(error) };
  }

  private write(level: LogLevel, params: Partial<LogParams> | string, messageOverride?: string) {
    const isStringParam = typeof params === 'string';
    const msg = isStringParam ? params : messageOverride || params.message;
    const extraParams = isStringParam ? {} : params;

    // Fetch dynamic RequestContext from AsyncLocalStorage
    const asyncContext = loggerContext.getStore() || {};

    const mergedData = {
      ...this.baseContext,
      ...asyncContext,
      ...extraParams,
    };

    const output: LogOutput = {
      schemaVersion: this.schemaVersion,
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: process.env.NODE_ENV || 'development',
      message: msg,
      ...mergedData,
    };

    if (output.error) {
      output.error = this.normalizeError(output.error);
    }

    // Redact sensitive PII recursively before sending to transport
    const safeOutput = redact(output) as LogOutput;

    this.transport.write(safeOutput);
  }

  public trace(params: Partial<LogParams> | string, message?: string) { this.write('TRACE', params, message); }
  public debug(params: Partial<LogParams> | string, message?: string) { this.write('DEBUG', params, message); }
  public info(params: Partial<LogParams> | string, message?: string) { this.write('INFO', params, message); }
  public warn(params: Partial<LogParams> | string, message?: string) { this.write('WARN', params, message); }
  public error(params: Partial<LogParams> | string, message?: string) { this.write('ERROR', params, message); }
  public fatal(params: Partial<LogParams> | string, message?: string) { this.write('FATAL', params, message); }
}

export const logger = new StructuredLogger();
