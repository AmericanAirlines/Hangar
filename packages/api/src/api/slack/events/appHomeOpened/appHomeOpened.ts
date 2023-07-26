import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { logger } from '../../../../utils/logger';

export const appHomeOpened: Middleware<SlackEventMiddlewareArgs<'app_home_opened'>> = async ({
  event,
  client,
}) => {
  try {
    // Call views.publish with the built-in client
    await client.views.publish({
      // Use the user ID associated with the event
      user_id: event.user,
      view: {
        // Home tabs must be enabled in your app configuration page under "App Home"
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Welcome home, <@${event.user}> :house:*`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>.',
            },
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};
