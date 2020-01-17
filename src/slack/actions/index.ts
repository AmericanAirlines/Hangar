import { App } from '@slack/bolt';
import logger from '../../logger';
import registerTeam from './registerTeam';
import ignore from './ignore';
import subscribe from './subscribe';
import unsubscribe from './unsubscribe';
import supportRequest from './supportRequest';

export default function register(app: App): void {
  logger.info('Registering action listeners');
  registerTeam(app);
  ignore(app);
  subscribe(app);
  unsubscribe(app);
  supportRequest(app);
}
