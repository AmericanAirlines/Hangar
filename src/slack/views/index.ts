import { App } from '@slack/bolt';
import logger from '../../logger';
import { callbackIds } from '../constants';
import { registerTeamSubmitted } from './registerTeamSubmitted';

export default function views(bolt: App): void {
  logger.info('Registering Slack view listeners');
  // Register all action listeners
  bolt.view(callbackIds.registerTeamSubmitted, registerTeamSubmitted);
}
