import Discord from 'discord.js';
import { SupportRequest, SupportRequestType, SupportRequestErrors } from '../../../entities/supportRequest';
import logger from '../../../logger';
import { Config } from '../../../entities/config';

export async function supportRequest(msg: Discord.Message): Promise<void> {
  const discordId = msg.author.id;
  const discordName = msg.author.username;
  const actionId = msg.content === '!technicalSupport' ? SupportRequestType.TechnicalSupport : SupportRequestType.IdeaPitch;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');
  if (!supportRequestQueueActive) {
    msg.author.send("**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!");
  } else {
    try {
      const requestItem = new SupportRequest(discordId, discordName, actionId);
      await requestItem.save();
      msg.author.send(
        ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
      );
    } catch (err) {
      if (err.name === SupportRequestErrors.ExistingActiveRequest) {
        await msg.author.send(
          "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
        );
      } else {
        await msg.author.send("**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.");
        logger.error('Something went wrong trying to create a support request', err);
      }
    }
  }
}
