import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import logger from '../../logger';
import { getDashboardContext } from '../utilities/getDashboardContext';

function register(bolt: App): void {
  bolt.event('app_mention', ({ event, say }) => {
    const { user } = event;
    say(`
    Hey there, <@${user}> :wave: I can help your team with technical support, you can request to pitch your idea to our team, and I'll also be used for judging! To see all of the things I can help with, simply send me a message and I'll respond with a dashboard of functionality for the hackathon :tada:`);
      });
}
export default register;