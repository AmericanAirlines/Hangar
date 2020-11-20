/* eslint-disable @typescript-eslint/camelcase */
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { app } from '..';
import logger from '../../logger';
import { stringDictionary } from '../../StringDictonary';

export const appMention: Middleware<SlackEventMiddlewareArgs<'app_mention'>> = async ({ context, payload }) => {
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel,
      thread_ts: payload.ts,
      text: stringDictionary.appMention,
    });
  } catch (error) {
    logger.error('Something went wrong responding to a bot mention: ', error);
  }
};
