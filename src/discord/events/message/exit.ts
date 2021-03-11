import Discord from 'discord.js';
import { stringDictionary } from '../../../StringDictionary';

export async function exit(msg: Discord.Message): Promise<void> {
  await msg.author.send(stringDictionary.exitFlow);
}
