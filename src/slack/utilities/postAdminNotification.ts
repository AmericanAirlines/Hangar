import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import logger from '../../logger';
import { env } from '../../env';
import { Config } from '../../entities/config';

export default async function postAdminNotification(message: string | IncomingWebhookSendArguments): Promise<void> {
  const webhookUrl = await Config.getValueAs('slackNotificationsWebhookURL', 'string', false);
  if (webhookUrl) {
    try {
      const webhook = new IncomingWebhook(webhookUrl);
      webhook.send(message);
    } catch (err) {
      logger.error('Something went wrong posting an admin update');
    }
  }
}
