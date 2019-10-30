import { App } from '@slack/bolt';
import logger from '../../logger';
import registerTeam from './registerTeam';
import ignore from './ignore';

export default function register(app: App): void {
  logger.info('Registering action listeners');
  registerTeam(app);
  ignore(app);
}
