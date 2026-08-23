// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://gavinf.com',
  integrations: [react()],
  // Hostname -> page mapping lives in worker.js: gavinf.com serves /,
  // auth.gavinf.com serves /auth/, dash.gavinf.com serves /dash/.
});
