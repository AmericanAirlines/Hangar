import { App, BlockAction } from '@slack/bolt';
import { ideaPitchRequestActionId, technicalRequestActionId } from '../constants';
import { getDashboardContext } from '../utilities/getDashboardContext';
import dashboardBlocks from '../blocks/dashboardBlocks';
import logger from '../../logger';
import { getWebClient } from '..';
import { Config } from '../../entities/config';
import { SupportRequest, SupportRequestType, SupportRequestErrors } from '../../entities/supportRequest';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

function register(bolt: App): void {
  bolt.action<BlockAction>({ action_id: RegExp(`${ideaPitchRequestActionId}|${technicalRequestActionId}`) }, async ({ ack, say, body, action }) => {
    ack();
    const actionId = action.action_id;
    const slackId = body.user.id;
    const slackName = body.user.name;

    const dashboardContext = await getDashboardContext(body.user.id);

    const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');

    if (!supportRequestQueueActive) {
      say(":see_no_evil: Our team isn't available to help at the moment, check back with us soon!");
    } else {
      try {
        const requestItem = new SupportRequest(
          slackId,
          slackName,
          actionId === ideaPitchRequestActionId ? SupportRequestType.IdeaPitch : SupportRequestType.TechnicalSupport,
        );
        await requestItem.save();
        say(
          ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
        );
      } catch (err) {
        if (err.name === SupportRequestErrors.ExistingActiveRequest) {
          say(
            ":warning: Looks like you're already waiting to get help from our team; keep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
          );
        } else {
          say(":warning: Something went wrong... come chat with our team and we'll help.");
          logger.error('Something went wrong trying to create a support request', err);
        }
      }
    }

    try {
      await getWebClient().chat.update({
        ts: body.message.ts,
        channel: body.channel.id,
        text: '',
        blocks: dashboardBlocks(dashboardContext),
      });
    } catch (err) {
      logger.error('Unable to update original message in Slack', err);
    }
  });
}

export default register;
