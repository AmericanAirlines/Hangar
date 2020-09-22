import { Middleware, SlackActionMiddlewareArgs, SlackAction } from '@slack/bolt';
import logger from '../../logger';

export const ignore: Middleware<SlackActionMiddlewareArgs<SlackAction>> = async ({ ack }) => {
  // Anything with this action_id should be ignored
  // Ack the request and do nothing
  logger.debug('Event ignored');
  ack();
};
