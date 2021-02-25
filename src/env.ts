// src/env.ts
import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    judgeSecret: 'JUDGE_SECRET',
    supportSecret: 'SUPPORT_SECRET',
    adminSecret: 'ADMIN_SECRET',
  },
  optional: {
    dbSSLDisabled: 'DB_SSL_DISABLED',
    slackBotToken: 'SLACK_BOT_TOKEN',
    slackSigningSecret: 'SLACK_SIGNING_SECRET',
    discordBotToken: 'DISCORD_BOT_TOKEN',
    discordChannelIds: 'DISCORD_BOT_CHANNEL_IDS',
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
