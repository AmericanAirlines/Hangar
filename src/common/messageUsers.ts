import { WebClient } from '@slack/web-api';
import { getActivePlatform, SupportedPlatform } from '.';
import messageSlackUsers from '../slack/utilities/messageUsers';
import { messageUsers as messageDiscordUsers } from '../discord/utilities/messageUsers';
import { Config } from '../entities/config';

let slackClient: WebClient;

export async function sendMessage(userIds: string[], message: string): Promise<void> {
  const activePlatform = await getActivePlatform();
  if (activePlatform === SupportedPlatform.slack) {
    if (!slackClient) {
      const token = await Config.getValueAs('slackBotToken', 'string', true);
      slackClient = new WebClient(token);
    }

    await messageSlackUsers(slackClient, userIds, message);
  } else {
    await messageDiscordUsers(userIds, message);
  }
}
