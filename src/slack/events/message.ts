import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import logger from '../../logger';
import { getDashboardContext } from '../utilities/getDashboardContext';

function register(bolt: App): void {
  bolt.message(async ({ say, message }) => {
    const dashboardContext = await getDashboardContext(message.user);

    try {
      // Only respond if the message doesn't have a subtype (i.e., original user message event, deletion/edits are ignored)
      if (!message.subtype) {
        say({
          text: '',
          blocks: dashboardBlocks(dashboardContext),
        });
      }
    } catch (err) {
      logger.error('Something went wrong messaging the user...', err);
    }
  });

  bolt.event('app_mention', ({ event, say }) => {
    console.log(event);
    const { text, user } = event;
    say(`

Hello, <@${user}>! 
Welcome to Hangar developed by American Airlines.
This app is a great way to show your skills.
To use the bot you can just simply send a message to the bot it will respond with a Dashboard that has all the functionality that you will need. :tada:`);
  });
}

export default register;
