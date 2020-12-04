import Discord from 'discord.js';
import { SupportRequest, SupportRequestType, SupportRequestErrors } from '../../../entities/supportRequest';
import logger from '../../../logger';
import { Config } from '../../../entities/config';
import { stringDictionary } from '../../../StringDictonary';

export async function supportRequest(msg: Discord.Message): Promise<void> {
  const discordId = msg.author.id;
  const discordName = msg.author.username;
  const actionId = msg.content === '!technicalSupport' ? SupportRequestType.TechnicalSupport : SupportRequestType.IdeaPitch;

  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');
  if (!supportRequestQueueActive) {
    msg.author.send(stringDictionary.supportNotAvailable);
  } else {
    try {
      const requestItem = new SupportRequest(discordId, discordName, actionId);
      await requestItem.save();
      msg.author.send(stringDictionary.supportAddedQueue);
    } catch (err) {
      if (err.name === SupportRequestErrors.ExistingActiveRequest) {
        await msg.author.send(stringDictionary.supportAlredyinLine);
      } else {
        await msg.author.send(stringDictionary.supportError);
        logger.error('Something went wrong trying to create a support request', err);
      }
    }
  }
}
