/**
 * Log levels following standard severity scaling.
 */
export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogOutput {
  schemaVersion: number;
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  requestId?: string;
  userId?: string;
  route?: string;
  method?: string;
  event?: string;
  message?: string;
  error?: unknown;
  metadata?: Record<string, unknown>;
  [key: string]: unknown; // Allow extensions
}

/**
 * Transport layer abstraction.
 * Currently writes JSON to stdout, but can be seamlessly replaced with Pino, CloudWatch, etc.
 */
export interface LoggerTransport {
  write(log: LogOutput): void;
}

export class StdoutTransport implements LoggerTransport {
  write(log: LogOutput): void {
    // Write JSON to stdout in a single line
    const output = JSON.stringify(log);
    
    if (log.level === 'ERROR' || log.level === 'FATAL') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  }
}

export const defaultTransport = new StdoutTransport();
