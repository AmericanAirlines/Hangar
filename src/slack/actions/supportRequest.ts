import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { actionIds } from '../constants';
import logger from '../../logger';
import { app } from '..';
import { Config } from '../../entities/config';
import { SupportRequest, SupportRequestType, SupportRequestErrors } from '../../entities/supportRequest';
import postAdminNotification from '../utilities/postAdminNotification';
import { openAlertModal } from '../utilities/openAlertModal';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const supportRequest: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, body, action, context }) => {
  ack();
  const actionId = action.action_id;
  const slackId = body.user.id;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');

  if (!supportRequestQueueActive) {
    await openAlertModal(context.botToken, body.trigger_id, {
      title: 'Whoops...',
      text: ":see_no_evil: Our team isn't available to help at the moment, check back with us soon!",
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
        title: "You're All Set",
        text:
          ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
      });

      await postAdminNotification(
        `<@${body.user.id}> has been added to the ${actionId === actionIds.joinIdeaPitchRequestQueue ? 'Idea Pitch' : 'Tech Support'} queue!`,
      );
    } catch (err) {
      if (err.name === SupportRequestErrors.ExistingActiveRequest) {
        await openAlertModal(context.botToken, body.trigger_id, {
          title: 'Whoops...',
          text: ":warning: Looks like you're already waiting to get help from our team",
          blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'Keep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.',
              },
            },
          ],
        });
      } else {
        await openAlertModal(context.botToken, body.trigger_id, {
          title: 'Whoops...',
          text: ":warning: Something went wrong... come chat with our team and we'll help.",
        });
        logger.error('Something went wrong trying to create a support request', err);
      }
    }
  }
};
