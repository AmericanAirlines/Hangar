import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';
import { stringDictionary } from '../../StringDictonary';

export const messageRecieved: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ say, message }) => {
  try {
    // Only respond if the message doesn't have a subtype (i.e., original user message event, deletion/edits are ignored)
    if (!message.subtype) {
      say(stringDictionary.messageReceived);
    }
  } catch (err) {
    logger.error('Something went wrong messaging the user...', err);
  }
};
