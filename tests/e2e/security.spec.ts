import { test, expect } from '@playwright/test';

test.describe('Security Headers', { tag: ['@test.security'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Response should include all required security headers (SEC-002)', async ({ request }) => {
    const response = await request.get('/health');
    const headers = response.headers();
    
    // 1. Strict-Transport-Security (HSTS)
    expect(headers).toHaveProperty('strict-transport-security');
    
    // 2. Content-Security-Policy (CSP)
    expect(
      headers['content-security-policy'] || headers['content-security-policy-report-only']
    ).toBeDefined();
    
    // 3. X-Frame-Options
    expect(headers).toHaveProperty('x-frame-options');
    expect(headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/i);
    
    // 4. X-Content-Type-Options
    expect(headers).toHaveProperty('x-content-type-options', 'nosniff');

    // 5. Referrer Policy
    expect(headers).toHaveProperty('referrer-policy');
    
    // 6. Permissions Policy
    expect(headers).toHaveProperty('permissions-policy');
  });
});
