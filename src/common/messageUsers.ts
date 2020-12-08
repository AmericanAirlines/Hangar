import { getActivePlatform, SupportedPlatform } from '.';
import messageSlackUsers from '../slack/utilities/messageUsers';
import { messageUsers as messageDiscordUsers } from '../discord/utilities/messageUsers';

export async function sendMessage(userIds: string[], message: string): Promise<void> {
  if (getActivePlatform() === SupportedPlatform.slack) {
    await messageSlackUsers(userIds, message);
  } else {
    await messageDiscordUsers(userIds, message);
  }
}
