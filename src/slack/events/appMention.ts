/* eslint-disable @typescript-eslint/camelcase */
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';
import { stringDictionary } from '../../StringDictionary';

export const appMention: Middleware<SlackEventMiddlewareArgs<'app_mention'>> = async ({ payload, client }) => {
  try {
    await client.chat.postMessage({
      channel: payload.channel,
      thread_ts: payload.ts,
      text: stringDictionary.appMention,
    });
  } catch (error) {
    logger.error('Something went wrong responding to a bot mention: ', error);
  }
};
