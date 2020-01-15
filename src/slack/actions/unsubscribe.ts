import { App, BlockAction } from '@slack/bolt';
import { unsubscribeActionId } from '../constants';
import { getDashboardContext } from '../utilities/getDashboardContext';
import { Subscriber } from '../../entities/subscriber';
import dashboardBlocks from '../blocks/dashboardBlocks';
import { slackAPI } from '..';
import logger from '../../logger';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

function register(bolt: App): void {
  bolt.action<BlockAction>({ action_id: unsubscribeActionId }, async ({ ack, say, body }) => {
    ack();
    const slackId = body.user.id;
    const dashboardContext = await getDashboardContext(body.user.id);

    if (!dashboardContext.isSubscribed) {
      // User is alredy unsubscribed
      // The original block will soon reflect the current state, so do nothing
    } else {
      // Create new subscribed user
      // TODO: Replace with Upsert
      const subscriber = (await Subscriber.findOne({ slackId })) || new Subscriber(body.user.id);
      subscriber.isActive = false;
      await subscriber.save();
      dashboardContext.isSubscribed = false;
    }

    try {
      await slackAPI.chat.update({
        ts: body.message.ts,
        channel: body.channel.id,
        text: '',
        blocks: dashboardBlocks(dashboardContext),
      });
    } catch (err) {
      logger.error('Unable to update original message in Slack', err);
    }

    say("You've been unsubscribed. You can subscribe again at any time if you miss us.");
  });
}

export default register;
