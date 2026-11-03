// @ts-check
import { defineConfig } from 'astro/config';

// Two static pages, no JavaScript shipped: gavinf.com (/) and dash.gavinf.com (/dash/).
// Hostname -> page mapping lives in worker.js.
export default defineConfig({
  site: 'https://gavinf.com',
});
