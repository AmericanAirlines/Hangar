import Discord from 'discord.js';
import { commands } from '.';
import { colors } from '../../constants';

export async function help(msg: Discord.Message): Promise<void> {
  await msg.author.send({
    embed: {
      color: colors.info,
      title: '**Welcome to the Hangar bot** :wave:',
      description: `Listed below are various commands that you can use to interact with the bot!\n\nIf you are looking for more information in regard to this challenge, [Click Here](${process.env.CHALLENGE_URL})`,
      fields: commands.map((command) => ({
        name: `**\n**\`${command.trigger}\``,
        value: command.description,
      })),
    },
  });
  if (msg.channel.type !== 'dm') {
    await msg.reply('Hey there! :wave:\nCheck your DMs for information on how to interact with me!');
  }
}
