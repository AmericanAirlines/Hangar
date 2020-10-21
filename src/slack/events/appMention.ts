/* eslint-disable @typescript-eslint/camelcase */
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { app } from '..';
import logger from '../../logger';

export const appMention: Middleware<SlackEventMiddlewareArgs<'app_mention'>> = async ({ context, payload }) => {
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel,
      thread_ts: payload.ts,
      text:
        "Hey there :wave: I can help your team during the hackathon! To see all of the things I can help with, simply click/tap my name and choose 'Go to App' :tada:",
    });
  } catch (error) {
    logger.error('Something went wrong responding to a bot mention: ', error);
  }
};
