import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    baseUrl: 'NEXT_PUBLIC_BASE_URL',
    sessionSecret: 'SESSION_SECRET',
  },
  optional: {
    // Add optional env vars here
  },
});
