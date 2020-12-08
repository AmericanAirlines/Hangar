import { activePlatform } from '../common';
import messageUsers from '../slack/utilities/messageUsers';
import { client } from '../discord/index';

export async function sendMessage(userIds: string[], message: string): Promise<void> {
  if (activePlatform === 'Slack') {
    await messageUsers(userIds, message); // This is imported from src/slack/utilities/messageUsers.ts
  } else {
    await Promise.all(
      userIds.map(async (id) => {
        const user = await client.users.fetch(id).catch(() => null); // client is imported from src/discord/index.ts

        if (user) {
          user.send(message);
        }
      }),
    );
  }
}
