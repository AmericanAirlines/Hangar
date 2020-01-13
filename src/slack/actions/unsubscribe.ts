import { App } from '@slack/bolt';
import { unsubscribeActionId } from '../constants';
import { getDashboardContext } from '../utilities/getDashboardContext';
import { Subscriber } from '../../entities/subscriber';
import dashboardBlocks from '../blocks/dashboardBlocks';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

function register(bolt: App): void {
  bolt.action({ action_id: unsubscribeActionId }, async ({ ack, say, body }) => {
    ack();
    const slackId = body.user.id;
    const dashboardContext = await getDashboardContext(body.user.id);

    if (!dashboardContext.isSubscribed) {
      // User is alredy unsubscribed
      // TODO: Indicate that they were already unsubscribed
    } else {
      // Create new subscribed user
      // TODO: Replace with Upsert
      const subscriber = (await Subscriber.findOne({ slackId })) || new Subscriber(body.user.id);
      subscriber.isActive = false;
      await subscriber.save();
      dashboardContext.isSubscribed = false;
    }

    say({
      text: '',
      blocks: dashboardBlocks(dashboardContext),
    });
  });
}

export default register;
