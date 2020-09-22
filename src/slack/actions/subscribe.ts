import { BlockAction, Middleware, SlackActionMiddlewareArgs } from '@slack/bolt';
import { Subscriber } from '../../entities/subscriber';
import { getDashboardContext } from '../utilities/getDashboardContext';
import dashboardBlocks from '../blocks/dashboardBlocks';
import logger from '../../logger';
import { app } from '..';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase */

export const subscribe: Middleware<SlackActionMiddlewareArgs<BlockAction>> = async ({ ack, say, context, body }) => {
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

  try {
    await app.client.chat.update({
      token: context.botToken,
      ts: body.message.ts,
      channel: body.channel.id,
      text: '',
      blocks: dashboardBlocks(dashboardContext),
    });
  } catch (err) {
    logger.error('Unable to update original message in Slack', err);
  }

  say("You've subscribed! Keep an eye out from direct messages sent from this bot.");
};
