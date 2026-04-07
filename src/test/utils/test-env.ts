export function applyTestEnv() {
  process.env.AUTH_SECRET = process.env.AUTH_SECRET ?? "test-auth-secret";
  process.env.N8N_CALLBACK_SECRET = process.env.N8N_CALLBACK_SECRET ?? "test-n8n-secret";
  process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!process.env.TEST_DATABASE_URL) {
    return false;
  }

  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  return true;
}
