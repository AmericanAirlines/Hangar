import setEnv from '@americanairlines/simple-env';

export const slackAuth = setEnv({
  required: {
    botToken: 'SLACK_BOT_TOKEN',
    signingSecret: 'SLACK_SIGNING_SECRET',
    clientId: 'SLACK_CLIENT_ID',
    clientSecret: 'SLACK_CLIENT_SECRET',
  },
});
