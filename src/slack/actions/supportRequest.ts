import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { actionIds } from '../constants';
import logger from '../../logger';
import { Config } from '../../entities/config';
import { SupportRequest, SupportRequestErrors } from '../../entities/supportRequest';
import { SupportRequestType } from '../../types/supportRequest';
import postAdminNotification from '../utilities/postAdminNotification';
import { openAlertModal } from '../utilities/openAlertModal';
import { stringDictionary } from '../../StringDictionary';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const supportRequest: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, body, action, client }) => {
  ack();
  const actionId = action.action_id;
  const slackId = body.user.id;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');

  if (!supportRequestQueueActive) {
    await openAlertModal(client, body.trigger_id, {
      title: stringDictionary.supportRequestWhoops,
      text: stringDictionary.supportRequestNotOpentext,
    });
  } else {
    let slackName = 'Unknown (Check logs)';
    try {
      const result = await client.users.info({ user: slackId });
      slackName = (result?.user as { [key: string]: string })?.real_name as string;
    } catch (err) {
      logger.error('Something went wrong retrieving Slack user details', err);
    }

    let requestType = null;
    let requestTypeTitle = null;
    switch (actionId) {
      case actionIds.joinIdeaPitchRequestQueue:
        requestType = SupportRequestType.IdeaPitch;
        requestTypeTitle = 'Idea Pitch';
        break;
      case actionIds.joinTechnicalRequestQueue:
        requestType = SupportRequestType.TechnicalSupport;
        requestTypeTitle = 'Tech Request';
        break;
      default:
        requestType = SupportRequestType.JobChat;
        requestTypeTitle = 'Job Chat';
    }
    try {
      const requestItem = new SupportRequest(slackId, slackName, requestType);
      await requestItem.save();
      await openAlertModal(client, body.trigger_id, {
        title: stringDictionary.supportRequestOpentitle,
        text: stringDictionary.supportRequestOpentext,
      });

      await postAdminNotification(`<@${body.user.id}> has been added to the ${requestTypeTitle} queue!`);
    } catch (err) {
      if (err.name === SupportRequestErrors.ExistingActiveRequest) {
        await openAlertModal(client, body.trigger_id, {
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
        await openAlertModal(client, body.trigger_id, {
          title: 'Whoops...',
          text: stringDictionary.supportRequestAlertModaltext,
        });
        logger.error('Something went wrong trying to create a support request', err);
      }
    }
  }
};
