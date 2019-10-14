import { App } from '@slack/bolt';
import { registerTeamActionId } from '../constants';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

function register(bolt: App): void {
  bolt.action({ action_id: registerTeamActionId }, async ({ ack, say }) => {
    ack();
    say({
      text: "You're registered!",
    });
  });
}

export default register;
