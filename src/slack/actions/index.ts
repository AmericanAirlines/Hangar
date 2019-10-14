import { App } from '@slack/bolt';
import logger from '../../logger';
import registerTeam from './registerTeam';

export default function register(app: App): void {
  logger.info('Registering action listeners');
  registerTeam(app);
}
