import setEnv from '@americanairlines/simple-env';

export const slackAuth = setEnv({
  required: {
    slackBotToken: 'SLACK_BOT_TOKEN',
    slackSigningSecret: 'SLACK_SIGNING_SECRET',
    slackClientID: 'SLACK_CLIENT_ID',
    slackClientSecret: 'SLACK_CLIENT_SECRET',
  },
  optional: {
    slackLogLevel: 'SLACK_LOG_LEVEL',
  },
});
