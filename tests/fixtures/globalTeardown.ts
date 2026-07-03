import { resetDb } from '../seed/reset';

export default async function globalTeardown() {
  console.log('Running global teardown to clean up E2E DB data...');
  await resetDb();
}
