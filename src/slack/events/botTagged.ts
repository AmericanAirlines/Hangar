import { App } from '@slack/bolt';
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';

export const botTagged: Middleware<SlackEventMiddlewareArgs<'app_mention'>> = async ({ event, say }) =>{

  try {
    say(`
    Hey there :wave: I can help your team during the hackathon! To see all of the things I can help with, simply click/tap my name and chose `Go to App` :tada:`);
  
  } catch (error) {
    logger.error('Something went wrong responding to a bot mention: ', error);
  }
}
