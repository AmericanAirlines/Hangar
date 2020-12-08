import Discord from 'discord.js';
import { commands } from '.';
import { colors } from '../../constants';
import { stringDictionary } from '../../../StringDictonary';

export const hiddenHandlers = ['ping'];

export async function help(msg: Discord.Message): Promise<void> {
  await msg.author.send({
    embed: {
      color: colors.info,
      title: stringDictionary.welcomeTitle,
      description: stringDictionary.welcomeDescription,
      fields: commands
        .filter((command) => !hiddenHandlers.includes(command.handlerId))
        .map((command) => ({
          name: `**\n**\`${command.trigger}\``,
          value: command.description,
        })),
    },
  });
  if (msg.channel.type !== 'dm') {
    await msg.reply(stringDictionary.welcomeReply);
  }
}
