// src/env.ts
import setEnv from '@americanairlines/simple-env';

const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    judgeSecret: 'JUDGE_SECRET',
    supportSecret: 'SUPPORT_SECRET',
    adminSecret: 'ADMIN_SECRET',
    challengeUrl: 'CHALLENGE_URL',
  },
  optional: {
    dbSSLDisabled: 'DB_SSL_DISABLED',
    slackBotToken: 'SLACK_BOT_TOKEN',
    slackSigningSecret: 'SLACK_SIGNING_SECRET',
    discordBotToken: 'DISCORD_BOT_TOKEN',
    discordChannelIds: 'DISCORD_BOT_CHANNEL_IDS',
    pgUser: 'PG_USER',
    pgPassword: 'PG_PASSWORD',
  },
});

export default env;
