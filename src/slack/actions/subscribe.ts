import { App } from '@slack/bolt';
import { subscribeActionId } from '../constants';
import { Subscriber } from '../../entities/subscriber';
import { getDashboardContext } from '../utilities/getDashboardContext';
import dashboardBlocks from '../blocks/dashboardBlocks';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

function register(bolt: App): void {
  bolt.action({ action_id: subscribeActionId }, async ({ ack, say, body }) => {
    ack();
    const slackId = body.user.id;
    const dashboardContext = await getDashboardContext(body.user.id);

    if (dashboardContext.isSubscribed) {
      // User is alredy subscribed
      // TODO: Indicate that they were already subscribed
    } else {
      // Create new subscribed user
      // TODO: Replace with Upsert
      const subscriber = (await Subscriber.findOne({ slackId })) || new Subscriber(body.user.id);
      subscriber.isActive = true;
      await subscriber.save();
      dashboardContext.isSubscribed = true;
    }

    // TODO: Update original block in place
    // bolt.client.chat.update({
    //   ts: action.
    //   text: '',
    //   blocks: dashboardBlocks(dashboardContext),
    // })

    say({
      text: '',
      blocks: dashboardBlocks(dashboardContext),
    });
  });
}

export default register;
