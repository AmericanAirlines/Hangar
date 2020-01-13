import { slackAPI } from '..';
import logger from '../../logger';

import { DmOpenResult } from '../types';

export default async function messageUsers(users: string[], message: string): Promise<void> {
  const errors: { [userId: string]: Error }[] = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    try {
      const dm = (await slackAPI.conversations.open({
        users: users[i],
      })) as DmOpenResult;

      await slackAPI.chat.postMessage({
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
    throw errors;
  }
}

async function waitBeforeNextRequest(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
