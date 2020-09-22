import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { registerTeamSubmitted } from './registerTeamSubmitted';

export default function views(bolt: App): void {
  // Register all action listeners
  bolt.view(callbackIds.registerTeamSubmitted, registerTeamSubmitted);
}
