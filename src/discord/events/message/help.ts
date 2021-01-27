import Discord from 'discord.js';
import { commands } from '.';
import { colors } from '../../constants';

export const hiddenHandlers = ['ping'];

export async function help(msg: Discord.Message): Promise<void> {
  await msg.author.send({
    embed: {
      color: colors.info,
      title: '**Welcome to Hangar** :wave:',
      description: `**PRIZES** - Think your team has what it takes to win?\nCheck out our :sparkles:[**CHALLENGE AND PRIZES**](${process.env.CHALLENGE_URL}):sparkles:\n\n**SWAG** - Want a free American Hacker shirt? Make sure to come chat with us about jobs, your idea, or get technical help using the options below!\n\n**BONUS PRIZES** - Hack on our challenge? Use \`!registerTeam\` below and you’ll be entered into a raffle to win prizes for your whole team!\n\n\nListed below are various commands that you can use to interact with the bot!`,
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
