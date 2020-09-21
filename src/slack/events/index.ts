import { App } from '@slack/bolt';
import { messageRecieved } from './messageRecieved';

export default function views(bolt: App): void {
  // Register all action listeners
  bolt.message(messageRecieved);
}
