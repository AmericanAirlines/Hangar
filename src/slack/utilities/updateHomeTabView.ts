/* eslint-disable @typescript-eslint/camelcase */
import { WebClient } from '@slack/web-api';
import { dashboardBlocks } from '../blocks/dashboardBlocks';

export default async function updateHomeTabView(client: WebClient, userId: string): Promise<void> {
  await client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      callback_id: 'ignore',
      title: {
        type: 'plain_text',
        text: 'GitHub Discussions',
      },
      blocks: dashboardBlocks(),
    },
  });
}
