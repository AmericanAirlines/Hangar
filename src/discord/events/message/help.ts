import Discord from 'discord.js';
import { commands } from '.';
import { colors } from '../../constants';
import { stringDictionary } from '../../../StringDictionary';

export const hiddenHandlers = ['ping'];

export async function help(msg: Discord.Message): Promise<void> {
  console.log("Calling help");
  await msg.author.send({
    embed: {
      color: colors.info,
      title: stringDictionary.headerinfo,
      description: stringDictionary.prizeMessage,
      fields: [
        ...commands
          .filter((command) => !hiddenHandlers.includes(command.handlerId))
          .map((command) => ({
            name: `**\n**\`${command.displayTrigger}\``,
            value: command.description,
          })),
        { name: '**\n**', value: stringDictionary.appInfoMessage },
      ],
    },
  });
  if (msg.channel.type !== 'dm') {
    await msg.reply(stringDictionary.interactMessage);
  }
}
