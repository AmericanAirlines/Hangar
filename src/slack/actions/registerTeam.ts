import { Middleware, SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { registerTeamView } from '../blocks/registerTeam';
import logger from '../../logger';
import { Config } from '../../entities/config';
import { openAlertModal } from '../utilities/openAlertModal';
import { stringDictionary } from '../../StringDictionary';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

export const registerTeam: Middleware<SlackActionMiddlewareArgs<BlockButtonAction>> = async ({ body, ack, client }) => {
  ack();
  try {
    const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
    if (!teamRegistrationActive) {
      await openAlertModal(client, body.trigger_id, {
        title: 'Registration Not Open',
        text: stringDictionary.registrationNotOpen,
      });
      return;
    }

    await client.views.open({
      trigger_id: body.trigger_id,
      view: registerTeamView,
    });
  } catch (err) {
    logger.error('Error opening modal: ', err);
  }
};
