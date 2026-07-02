export interface AppMetadata {
  version: string;
  commit: string;
  uptime: number;
}

export function getAppMetadata(): AppMetadata {
  // Use npm_package_version or APP_VERSION to avoid hardcoding versions
  const version = process.env.APP_VERSION || process.env.npm_package_version || 'unknown';
  
  // Use standard Vercel environment variable for Git Commit SHA
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || 'unknown';
  
  // Note: In serverless environments (like Vercel), this represents 
  // the Instance Uptime (Lambda execution context lifespan), 
  // not the absolute global service uptime.
  const uptime = process.uptime();
  
  return { version, commit, uptime };
}
