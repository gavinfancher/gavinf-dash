// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

// auth.gavinf.com and dash.gavinf.com are nothing but a Clerk widget, so a
// build without the publishable key ships a blank page that only fails in the
// browser. Fail here instead. The key lives in .env.production.
const { PUBLIC_CLERK_PUBLISHABLE_KEY } = loadEnv(
  process.env.NODE_ENV ?? 'production',
  process.cwd(),
  'PUBLIC_',
);
if (!PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing PUBLIC_CLERK_PUBLISHABLE_KEY — see .env.example. Without it Clerk never mounts and /auth and /dash render empty.',
  );
}

export default defineConfig({
  site: 'https://gavinf.com',
  integrations: [react()],
  // Hostname -> page mapping lives in worker.js: gavinf.com serves /,
  // auth.gavinf.com serves /auth/, dash.gavinf.com serves /dash/.
});
