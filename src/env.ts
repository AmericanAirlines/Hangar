// src/env.ts
import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
  },
  optional: {
    dbSSLDisabled: 'DB_SSL_DISABLED',
    pgUser: 'PGUSER',
    pgPassword: 'PGPASSWORD',
    databaseUrl: 'DATABASE_URL',
    port: 'PORT',
    logLevel: 'LOG_LEVEL',
    slackLogLevel: 'SLACK_LOG_LEVEL',
    slackNotificationsWebhookURL: ' SLACK_NOTIFICATIONS_WEBHOOK_URL',
    challengeUrl: 'CHALLENGE_URL',
    jobChatUrl: 'JOB_CHAT_URL',
  },
});
