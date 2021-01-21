import Discord from 'discord.js';
import { commands } from '.';
import { colors } from '../../constants';

export const hiddenHandlers = ['ping'];

export async function help(msg: Discord.Message): Promise<void> {
  await msg.author.send({
    embed: {
      color: colors.info,
      title: '**Welcome to Hangar** :wave:',
      description: `Listed below are various commands that you can use to interact with the bot!\n\n**PRIZES**: Think your team has what it takes to win?\nCheck out our :sparkles:[**CHALLENGE AND PRIZES**](${process.env.CHALLENGE_URL}):sparkles:`,
      fields: [
        ...commands
          .filter((command) => !hiddenHandlers.includes(command.handlerId))
          .map((command) => ({
            name: `**\n**\`${command.trigger}\``,
            value: command.description,
          })),
        { name: '**\n**', value: '[Hangar](https://github.com/AmericanAirlines/Hangar) is an Open Source project created by American Airlines.' },
      ],
    },
  });
  if (msg.channel.type !== 'dm') {
    await msg.reply('Hey there! :wave:\nCheck your DMs for information on how to interact with me!');
  }
}
