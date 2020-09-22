import { App } from '@slack/bolt';
import { messageRecieved } from './messageRecieved';
import { appHomeOpened } from './appHomeOpened';

export default function views(bolt: App): void {
  // Register all action listeners
  bolt.message(messageRecieved);
  bolt.event('app_home_opened', appHomeOpened);
}
