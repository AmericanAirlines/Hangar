import { App, BlockAction, ViewSubmitAction } from '@slack/bolt';
import { WebAPICallResult } from '@slack/web-api';
import { registerTeamActionId, registerTeamViewConstants } from '../constants';
import { registerTeamView } from '../blocks/registerTeam';
import logger from '../../logger';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

interface DmOpenResult extends WebAPICallResult {
  channel: {
    id: string;
  };
}

interface ViewSubmitInputFieldState {
  type: string;
  value?: string;
  selected_users?: string[];
}

interface ViewSubmitStateValues {
  [blockId: string]: ViewSubmitInputFieldState;
}

interface ViewSubmitState {
  values: { [actionId: string]: ViewSubmitStateValues };
}

function register(bolt: App): void {
  bolt.action<BlockAction>({ action_id: registerTeamActionId }, async ({ body, ack, context }) => {
    ack();
    try {
      await bolt.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: registerTeamView,
      });
    } catch (err) {
      logger.error('Error opening modal: ', err);
    }
  });

  bolt.view<ViewSubmitAction>(registerTeamViewConstants.viewId, async ({
    ack, context, view, body,
  }) => {
    // TODO: Validate that users aren't already on a team
    // TODO: validate that table number hasn't already been used
    ack();
    try {
      const { values } = view.state as ViewSubmitState;
      const teamMembersBlock = values[registerTeamViewConstants.fields.teamMembers];
      const teamMembersField = teamMembersBlock[registerTeamViewConstants.fields.teamMembers];
      const teamMembers = new Set([...teamMembersField.selected_users, body.user.id]);
      logger.info(JSON.stringify([...teamMembersField.selected_users, body.user.id]));

      const dm = (await bolt.client.conversations.open({
        token: context.botToken,
        users: Array.from(teamMembers).join(','),
      })) as DmOpenResult;

      await bolt.client.chat.postMessage({
        token: context.botToken,
        channel: dm.channel.id,
        text: "Team registered successfully! We'll be around to your table sometime after judging starts",
      });
    } catch (err) {
      logger.error('Error registering team: ', err);
    }
  });
}

export default register;
