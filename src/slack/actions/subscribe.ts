import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { Subscriber } from '../../entities/subscriber';
import { getDashboardContext } from '../utilities/getDashboardContext';
import { openAlertModal } from '../utilities/openAlertModal';
import updateHomeTabView from '../utilities/updateHomeTabView';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const subscribe: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, context, body }) => {
  ack();
  const slackId = body.user.id;
  const dashboardContext = await getDashboardContext(body.user.id);

  if (dashboardContext.isSubscribed) {
    // User is alredy subscribed
    // The original block will soon reflect the current state, so do nothing
  } else {
    // Create new subscribed user
    // TODO: Replace with Upsert
    const subscriber = (await Subscriber.findOne({ slackId })) || new Subscriber(body.user.id);
    subscriber.isActive = true;
    await subscriber.save();
    dashboardContext.isSubscribed = true;
  }

  await openAlertModal(context.botToken, body.trigger_id, {
    title: "You're Subscribed",
    text: 'Keep an eye out from direct messages sent from this bot.',
  });
  await updateHomeTabView(slackId);
};
