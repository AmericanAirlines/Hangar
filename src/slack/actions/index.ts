/* eslint-disable @typescript-eslint/camelcase */
import { App } from '@slack/bolt';
import { actionIds } from '../constants';
import logger from '../../logger';
import { ignore } from './ignore';
import { registerTeam } from './registerTeam';
import { subscribe } from './subscribe';
import { unsubscribe } from './unsubscribe';
import { supportRequest } from './supportRequest';

export default function actions(bolt: App): void {
  logger.info('Registering Slack action listeners');
  // Register all action listeners
  bolt.action(actionIds.ignore, ignore);
  bolt.action(actionIds.registerTeam, registerTeam);
  bolt.action(actionIds.subscribe, subscribe);
  bolt.action(actionIds.unsubscribe, unsubscribe);
  bolt.action(RegExp(`${actionIds.joinIdeaPitchRequestQueue}|${actionIds.joinTechnicalRequestQueue}`), supportRequest);
}
