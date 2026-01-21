import { configDotenv } from 'dotenv';

import ProcessEnv = NodeJS.ProcessEnv;

const env: ProcessEnv = process.env;

configDotenv({ path: '.env', quiet: true, override: false });

export const environment = {
  isDevelopment: env.NODE_ENV === 'development' || true,
  api: {
    port: env.PORT || 3000,
    frontendUrl: env.FRONTEND_URL || 'http://localhost:3002',
  },
  nasa: {
    url: env.NASA_URL || 'https://api.nasa.gov',
    apiKey: env.NASA_API_KEY || 'DEMO_KEY',
  },
  swagger: {
    user: env.SWAGGER_USER || '',
    password: env.SWAGGER_PASSWORD || '',
  },
};
