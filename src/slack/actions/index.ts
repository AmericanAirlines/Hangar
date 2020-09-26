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
  bolt.action({ action_id: actionIds.ignore }, ignore);
  bolt.action({ action_id: actionIds.registerTeam }, registerTeam);
  bolt.action({ action_id: actionIds.subscribe }, subscribe);
  bolt.action({ action_id: actionIds.unsubscribe }, unsubscribe);
  bolt.action({ action_id: RegExp(`${actionIds.joinIdeaPitchRequestQueue}|${actionIds.joinTechnicalRequestQueue}`) }, supportRequest);
}
