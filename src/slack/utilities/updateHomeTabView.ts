/* eslint-disable @typescript-eslint/camelcase */
import { app } from '..';
import { dashboardBlocks } from '../blocks/dashboardBlocks';
import { Config } from '../../entities/config';

let token: string | null = null;

export default async function updateHomeTabView(userId: string): Promise<void> {
  token = token ?? await Config.getValueAs('slackBotToken', 'string', false);
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
      blocks: dashboardBlocks(),
    },
  });
}
