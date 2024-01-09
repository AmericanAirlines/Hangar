import setEnv from '@americanairlines/simple-env';

export const pingfedAuth = setEnv({
  required: {
    clientId: 'PINGFED_CLIENT_ID',
    clientSecret: 'PINGFED_CLIENT_SECRET',
    authBaseUrl: 'PINGFED_AUTH_BASE_URL',
    tokenBaseUrl: 'PINGFED_TOKEN_BASE_URL',
  },
});
