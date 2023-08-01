import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    baseURL: 'BASE_URL',
    slackBotToken: 'SLACK_BOT_TOKEN',
    slackSigningSecret: 'SLACK_SIGNING_SECRET',
    slackClientID: 'SLACK_CLIENT_ID',
    slackClientSecret: 'SLACK_CLIENT_SECRET',
  },
  optional: {
    slackLogLevel: 'SLACK_LOG_LEVEL',
  },
});
