import { ViewSubmitAction, ViewOutput, Middleware, SlackViewMiddlewareArgs } from '@slack/bolt';
import { app } from '..';
import { registerTeamViewConstants } from '../constants';
import { registeredTeamSummary } from '../blocks/registerTeam';
import logger from '../../logger';
import { Team } from '../../entities/team';
import { ViewSubmitState, DmOpenResult, ViewSubmitInputFieldState } from '../types';
import { Config } from '../../entities/config';
import postAdminNotification from '../utilities/postAdminNotification';
import { stringDictionary } from '../../StringDictonary';

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

export const registerTeamSubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({ ack, context, view, body }) => {
  const registeringUser = body.user.id;
  const tableNumber = parseInt(retrieveViewValuesForField(view, registerTeamViewConstants.fields.tableNumber, 'plainTextInput') as string, 10);

  if (Number.isNaN(tableNumber)) {
    ack({
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_action: 'errors',
      errors: {
        [registerTeamViewConstants.fields.tableNumber]: 'Table number must be a valid number',
      },
    });
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
  const tableNumberStr = tableNumber.toString();
  const formattedTeamMembers = allTeamMembers.map((member) => `<@${member}>`).join(', ');

  const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
  if (!teamRegistrationActive) {
    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: registeringUser,
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: stringDictionary.registerTeamNotOpen({
        teamName,
        tableNumber: tableNumberStr,
        projectDescription,
        formattedTeamMembers,
      }),
    });
    return;
  }

  try {
    const team = new Team(teamName, tableNumber, projectDescription, allTeamMembers);
    await team.save();

    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: allTeamMembers.join(','),
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: '',
      blocks: registeredTeamSummary(registeringUser, allTeamMembers, teamName, tableNumber, projectDescription),
    });

    await postAdminNotification(
      stringDictionary.teamSubmittedAdminNotification({
        tableNumber: tableNumberStr,
        formattedTeamMembers,
        registeringUser,
      }),
    );
  } catch (err) {
    // TODO: Determine a more appropriate error to share with the user
    logger.error('Error registering team: ', err);
    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: registeringUser,
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: stringDictionary.teamSubmittedpostMessage({
        teamName,
        tableNumber: tableNumberStr,
        projectDescription,
        formattedTeamMembers,
        err,
      }),
    });
  }
};
