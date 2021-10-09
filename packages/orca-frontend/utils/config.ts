const API_PRODUCTION_URL = 'https://api.getorca.org';
const API_DEV_URL = 'http://localhost:4000';

export const Config = {
  API_URL: process.env.NODE_ENV === 'production' ? API_PRODUCTION_URL : API_DEV_URL,
  GOOGLE_ANALYTICS_ID: 'G-MD706N8TZV',
};
