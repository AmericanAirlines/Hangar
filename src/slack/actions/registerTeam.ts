import { App, BlockAction, ViewSubmitAction, ViewOutput, RespondArguments } from '@slack/bolt';
import { registerTeamActionId, registerTeamViewConstants } from '../constants';
import { registerTeamView, registeredTeamSummary } from '../blocks/registerTeam';
import logger from '../../logger';
import { Team } from '../../entities/team';
import { ViewSubmitState, DmOpenResult, ViewSubmitInputFieldState } from '../types';
import { Config } from '../../entities/config';
import postAdminNotification from '../utilities/postAdminNotification';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

function retrieveViewValuesForField(
  view: ViewOutput,
  actionId: string,
  type: 'multiUsersSelect' | 'plainTextInput',
  optional = false,
): string | string[] {
  const { values } = view.state as ViewSubmitState;
  let blockData: ViewSubmitInputFieldState;
  try {
    blockData = values[actionId][actionId];
  } catch (err) {
    if (optional) {
      return null;
    }
    logger.error('Failed to parse field from view submission:', err);
  }

  switch (type) {
    case 'multiUsersSelect':
      return blockData.selected_users;
    case 'plainTextInput':
      return blockData.value;
    default:
      return null;
  }
}

function register(bolt: App): void {
  bolt.action<BlockAction>({ action_id: registerTeamActionId }, async ({ body, ack, context }) => {
    ack();
    try {
      const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
      if (!teamRegistrationActive) {
        const dm = (await bolt.client.conversations.open({
          token: context.botToken,
          users: body.user.id,
        })) as DmOpenResult;

        await bolt.client.chat.postMessage({
          token: context.botToken,
          channel: dm.channel.id,
          text: ':warning: Team registration is not open yet. Check back later once table numbers have been assigned!',
        });
        return;
      }

      await bolt.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: registerTeamView,
      });
    } catch (err) {
      logger.error('Error opening modal: ', err);
    }
  });

  bolt.view<ViewSubmitAction>(registerTeamViewConstants.viewId, async ({ ack, context, view, body }) => {
    const registeringUser = body.user.id;
    const tableNumber = parseInt(retrieveViewValuesForField(view, registerTeamViewConstants.fields.tableNumber, 'plainTextInput') as string, 10);

    if (Number.isNaN(tableNumber)) {
      // This is a hacky workaround until this issue is closed: https://github.com/slackapi/bolt/issues/305
      const error: any = {
        response_action: 'errors',
        errors: {
          [registerTeamViewConstants.fields.tableNumber]: 'Table number must be a valid number',
        },
      };
      // Invalid table number, show errors in the view and leave it open
      ack(error as RespondArguments);
      return;
    }

    // Before doing additional work, let's tell Slack know we can take it from here (we have to respond in < 3 seconds)
    ack();

    const optional = true;
    /* eslint-disable-next-line operator-linebreak */
    const teamMembers =
      (retrieveViewValuesForField(view, registerTeamViewConstants.fields.teamMembers, 'multiUsersSelect', optional) as string[]) || [];
    const allTeamMembers = Array.from(new Set([registeringUser, ...teamMembers]));
    const teamName = retrieveViewValuesForField(view, registerTeamViewConstants.fields.teamName, 'plainTextInput') as string;
    const projectDescription = retrieveViewValuesForField(view, registerTeamViewConstants.fields.projectDescription, 'plainTextInput') as string;

    const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
    if (!teamRegistrationActive) {
      const formattedTeamMembers = allTeamMembers.map((member) => `<@${member}>`);

      const dm = (await bolt.client.conversations.open({
        token: context.botToken,
        users: registeringUser,
      })) as DmOpenResult;

      await bolt.client.chat.postMessage({
        token: context.botToken,
        channel: dm.channel.id,
        text: `:warning: Team registration isn't currently open, please try again later or come chat with our team if you think this is an error.

Team Name: ${teamName}
TableNumber: ${tableNumber}
Project Description: ${projectDescription}
Team Members: ${formattedTeamMembers.join(', ')}
      `,
      });
      return;
    }

    try {
      const team = new Team(teamName, tableNumber, projectDescription, allTeamMembers);
      await team.save();

      const dm = (await bolt.client.conversations.open({
        token: context.botToken,
        users: allTeamMembers.join(','),
      })) as DmOpenResult;

      await bolt.client.chat.postMessage({
        token: context.botToken,
        channel: dm.channel.id,
        text: '',
        blocks: registeredTeamSummary(registeringUser, allTeamMembers, teamName, tableNumber, projectDescription),
      });

      const formattedTeamMembers = teamMembers.map((member) => `<@${member}>`).join(', ');
      await postAdminNotification(
        `<@${registeringUser}> registered their team for judging:\nTeam Members: ${formattedTeamMembers}\nTable Number: ${tableNumber}`,
      );
    } catch (err) {
      // TODO: Determine a more appropriate error to share with the user
      logger.error('Error registering team: ', err);
      const dm = (await bolt.client.conversations.open({
        token: context.botToken,
        users: registeringUser,
      })) as DmOpenResult;

      const formattedTeamMembers = allTeamMembers.map((member) => `<@${member}>`);
      await bolt.client.chat.postMessage({
        token: context.botToken,
        channel: dm.channel.id,
        text: `:warning: Something went wrong while registering your team... come chat with our team for help.

To help with resubmitting, here's the info you tried to submit:
Team Name: ${teamName}
TableNumber: ${tableNumber}
Project Description: ${projectDescription}
Team Members: ${formattedTeamMembers.join(', ')}

Here's what went wrong, it may be helpful (but probably not):
\`\`\`
${JSON.stringify(err, null, 2)}
\`\`\`
`,
      });
    }
  });
}

export default register;
