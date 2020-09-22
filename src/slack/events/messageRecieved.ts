import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';

export const messageRecieved: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ say, message }) => {
  try {
    // Only respond if the message doesn't have a subtype (i.e., original user message event, deletion/edits are ignored)
    if (!message.subtype) {
      say(
        "Hey there :wave: I'm a bot designed to provide you with resources for the hackathon! Most of my functionality can be accessed via the Home Tab above. To get started, just click/tap `Home` at the top of your screen.\n\nOccasionally I'll send you updates here as well, so keep an eye out for unread messages in your sidebar.",
      );
    }
  } catch (err) {
    logger.error('Something went wrong messaging the user...', err);
  }
};
