import { ViewSubmitAction, ViewOutput, Middleware, SlackViewMiddlewareArgs } from '@slack/bolt';
import { app } from '..';
import { joinSupportQueueConstants } from '../constants';
import { joinedSupportQueueSummary } from '../blocks/joinSupportQueue';
import { SupportRequestType } from '../../types/supportRequest';
import { SupportRequest } from '../../entities/supportRequest';
import logger from '../../logger';
import { ViewSubmitState, DmOpenResult, ViewSubmitInputFieldState } from '../types';
import { Config } from '../../entities/config';
import postAdminNotification from '../utilities/postAdminNotification';
import { stringDictionary } from '../../StringDictionary';

function retrieveViewValuesForField(view: ViewOutput, actionId: string, type: 'plainTextInput', optional = false): string {
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
  return blockData.value;
}

export const joinSupportQueueSubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({ ack, context, view, body }) => {
  const registeringUser = body.user.id;
  // Before doing additional work, let's tell Slack know we can take it from here (we have to respond in < 3 seconds)
  ack();

  /* eslint-disable-next-line operator-linebreak */
  const primaryLanguage = retrieveViewValuesForField(view, joinSupportQueueConstants.fields.primaryLanguage, 'plainTextInput') as string;
  const problemDescription = retrieveViewValuesForField(view, joinSupportQueueConstants.fields.problemDescription, 'plainTextInput') as string;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');
  if (!supportRequestQueueActive) {
    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: registeringUser,
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: stringDictionary.joinSupportQueueNotOpen({
        primaryLanguage,
        projectDescription: problemDescription,
      }),
    });
    return;
  }

  try {
    const slackId = body.user.id;
    const requestItem = new SupportRequest(slackId, registeringUser, SupportRequestType.TechnicalSupport);

    await requestItem.save();

    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: registeringUser,
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: '',
      blocks: joinedSupportQueueSummary(primaryLanguage, problemDescription),
    });

    // TODO: Use the open alert util to notify the user and check the messages
    await postAdminNotification(
      stringDictionary.joinedSupportQueueAdminNotification({
        primaryLanguage,
        registeringUser,
      }),
    );
  } catch (err) {
    // TODO: Determine a more appropriate error to share with the user
    logger.error('Error joining help queue: ', err);

    const dm = (await app.client.conversations.open({
      token: context.botToken,
      users: registeringUser,
    })) as DmOpenResult;

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: dm.channel.id,
      text: stringDictionary.joinedSupportQueuepostMessage({
        primaryLanguage,
        problemDescription,
        err,
      }),
    });
  }
};
