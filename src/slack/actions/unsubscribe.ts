import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { getDashboardContext } from '../utilities/getDashboardContext';
import { Subscriber } from '../../entities/subscriber';
import { openAlertModal } from '../utilities/openAlertModal';
import updateHomeTabView from '../utilities/updateHomeTabView';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const unsubscribe: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, context, body }) => {
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

  await openAlertModal(context.botToken, body.trigger_id, {
    title: "You've been unsubscribed",
    text: 'You can subscribe again at any time if you miss us.',
  });
  await updateHomeTabView(slackId);
};
