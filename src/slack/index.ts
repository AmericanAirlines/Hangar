import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const bolt = new App({ receiver, token: process.env.SLACK_BOT_TOKEN });

bolt.message(({ say, body }) => {
  say(body.event.text);
});

export const slackApp = receiver.app;
