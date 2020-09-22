import { App } from '@slack/bolt';
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';

export const botTagged: Middleware<SlackEventMiddlewareArgs<'app_mention'>> = async ({ event, say }) =>{

  try {
    say(`
    Hey there, :wave: I can help your team with technical support, you can request to pitch your idea to our team, and I'll also be used for judging! To see all of the things I can help with, simply send me a message and I'll respond with a dashboard of functionality for the hackathon :tada:`);
  
  } catch (error) {
    logger.error('Something went wrong tagging the bot: ', error);
  }
}

