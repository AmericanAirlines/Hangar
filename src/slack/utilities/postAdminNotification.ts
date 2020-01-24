import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import logger from '../../logger';

const webhookUrl = process.env.SLACK_NOTIFICATIONS_WEBHOOK_URL;

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
