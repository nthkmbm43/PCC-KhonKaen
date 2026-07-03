import { test, expect } from '@playwright/test';

test.describe('Health Probes', { tag: ['@test.health', '@test.smoke'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('/health returns 200 OK and correct schema', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Validate schema instead of snapshot because uptime/commit can change
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('commit');
    expect(body).toHaveProperty('uptime');
  });

  test('/live returns 200 OK and correct schema', async ({ request }) => {
    const response = await request.get('/live');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('commit');
  });

  test('/ready returns correct schema', async ({ request }) => {
    const response = await request.get('/ready');
    const body = await response.json();
    
    // Can't use exact snapshot because database/redis times out dynamically
    expect(['ok', 'degraded', 'error']).toContain(body.status);
    expect(body.checks).toHaveProperty('database');
  });
});
