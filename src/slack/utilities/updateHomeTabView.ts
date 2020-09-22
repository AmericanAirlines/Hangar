/* eslint-disable @typescript-eslint/camelcase */
import { app } from '..';
import getRequiredEnvVar from '../../utilities/getRequiredEnvVar';
import { dashboardBlocks } from '../blocks/dashboardBlocks';
import { getDashboardContext } from './getDashboardContext';

const token = getRequiredEnvVar('SLACK_BOT_TOKEN');

export default async function updateHomeTabView(userId: string): Promise<void> {
  const context = await getDashboardContext(userId);
  await app.client.views.publish({
    token,
    user_id: userId,
    view: {
      type: 'home',
      callback_id: 'ignore',
      title: {
        type: 'plain_text',
        text: 'GitHub Discussions',
      },
      blocks: dashboardBlocks(context),
    },
  });
}
