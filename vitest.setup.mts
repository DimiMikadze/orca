import { loadEnvConfig } from '@next/env';

// @next/env skips .env.local when NODE_ENV=test by design.
// Override temporarily to load .env.local for integration tests that hit real APIs.
const nodeEnv = process.env.NODE_ENV;
(process.env as Record<string, string | undefined>).NODE_ENV = undefined;
loadEnvConfig(process.cwd());
(process.env as Record<string, string | undefined>).NODE_ENV = nodeEnv;
