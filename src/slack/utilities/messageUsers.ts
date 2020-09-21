import { app } from '..';
import logger from '../../logger';
import getRequiredEnvVar from '../../utilities/getRequiredEnvVar';
import { DmOpenResult } from '../types';

const token = getRequiredEnvVar('SLACK_BOT_TOKEN');

export default async function messageUsers(users: string[], message: string): Promise<void> {
  const errors: { [userId: string]: Error }[] = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    try {
      const dm = (await app.client.conversations.open({
        token,
        users: users[i],
      })) as DmOpenResult;

      await app.client.chat.postMessage({
        token,
        channel: dm.channel.id,
        text: message,
      });

      // Rate limiting for this behavior is capped at ~1 per second, but burst behavior is allowed
      await waitBeforeNextRequest(500);
    } catch (err) {
      errors.push({ [user]: err });
    }
  }

  if (errors.length) {
    logger.error(`Unable to send update to ${errors.length === users.length ? 'all' : 'some'} users:`, errors);
    throw new Error(`Unable to send update to ${errors.length === users.length ? 'all' : 'some'} users: ${JSON.stringify(errors)}`);
  }
}

async function waitBeforeNextRequest(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
