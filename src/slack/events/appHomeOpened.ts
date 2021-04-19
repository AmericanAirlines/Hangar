/* eslint-disable camelcase */
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';
import updateHomeTabView from '../utilities/updateHomeTabView';

export const appHomeOpened: Middleware<SlackEventMiddlewareArgs<'app_home_opened'>> = async ({ event, client }) => {
  try {
    await updateHomeTabView(client, event.user);
  } catch (error) {
    logger.error('Something went wrong publishing a view to Slack: ', error);
  }
};
