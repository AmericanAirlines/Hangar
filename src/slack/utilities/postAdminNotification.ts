import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import logger from '../../logger';
import { env } from '../../env';

const webhookUrl = env.slackNotificationsWebhookURL;

export default async function postAdminNotification(message: string | IncomingWebhookSendArguments): Promise<void> {
  if (webhookUrl) {
    try {
      const webhook = new IncomingWebhook(webhookUrl);
      webhook.send(message);
    } catch (err) {
      logger.error('Something went wrong posting an admin update');
    }
  }
}
