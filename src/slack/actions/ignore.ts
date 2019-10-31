import { App } from '@slack/bolt';
import { ignoreActionId } from '../constants';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

// Anything with this action_id should be ignored
//  Ack the request and do nothing

function register(bolt: App): void {
  bolt.action({ action_id: ignoreActionId }, async ({ ack }) => {
    ack();
  });
}

export default register;
