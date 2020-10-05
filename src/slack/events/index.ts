import { App } from '@slack/bolt';
import { messageRecieved } from './messageRecieved';
import { appHomeOpened } from './appHomeOpened';
import { appMention } from './appMention';
import logger from '../../logger';

export default function views(bolt: App): void {
  logger.info('Registering Slack event listeners');
  // Register all action listeners
  bolt.message(messageRecieved);
  bolt.event('app_home_opened', appHomeOpened);
  bolt.event('app_mention', appMention);
}
