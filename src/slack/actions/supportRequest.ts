import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { actionIds } from '../constants';
import logger from '../../logger';
import { app } from '..';
import { Config } from '../../entities/config';
import { SupportRequest, SupportRequestType, SupportRequestErrors } from '../../entities/supportRequest';
import postAdminNotification from '../utilities/postAdminNotification';
import { openAlertModal } from '../utilities/openAlertModal';
import { stringDictionary } from '../../StringDictonary';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const supportRequest: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, body, action, context }) => {
  ack();
  const actionId = action.action_id;
  const slackId = body.user.id;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');

  if (!supportRequestQueueActive) {
    await openAlertModal(context.botToken, body.trigger_id, {
      title: stringDictionary.supportRequestWhoops,
      text: stringDictionary.supportRequestNotOpentext,
    });
  } else {
    let slackName = 'Unknown (Check logs)';
    try {
      const result = await app.client.users.info({ user: slackId, token: context.botToken });
      slackName = (result?.user as { [key: string]: string })?.real_name as string;
    } catch (err) {
      logger.error('Something went wrong retrieving Slack user details', err);
    }

    try {
      const requestItem = new SupportRequest(
        slackId,
        slackName,
        actionId === actionIds.joinIdeaPitchRequestQueue ? SupportRequestType.IdeaPitch : SupportRequestType.TechnicalSupport,
      );
      await requestItem.save();
      await openAlertModal(context.botToken, body.trigger_id, {
        title: stringDictionary.supportRequestOpentitle,
        text: stringDictionary.supportRequestOpentext,
      });

      await postAdminNotification(
        `<@${body.user.id}> has been added to the ${actionId === actionIds.joinIdeaPitchRequestQueue ? 'Idea Pitch' : 'Tech Support'} queue!`,
      );
    } catch (err) {
      if (err.name === SupportRequestErrors.ExistingActiveRequest) {
        await openAlertModal(context.botToken, body.trigger_id, {
          title: stringDictionary.supportRequestWhoops,
          text: stringDictionary.supportRequestAlreadyInLinetext,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: stringDictionary.supportRequestExistingActiveRequest,
              },
            },
          ],
        });
      } else {
        await openAlertModal(context.botToken, body.trigger_id, {
          title: 'Whoops...',
          text: stringDictionary.supportRequestAlertModaltext,
        });
        logger.error('Something went wrong trying to create a support request', err);
      }
    }
  }
};
