import Discord from 'discord.js';

export async function help(msg: Discord.Message): Promise<void> {
  await msg.author.send({
    embed: {
      color: 1480420,
      title: '**Welcome to the Hangar bot** :wave:',
      description: `Listed below are various commands that you can use to interact with the bot!\n\nIf you are looking for more information in regard to this challenge, [Click Here](${process.env.CHALLENGE_URL})`,
      fields: [
        {
          name: '**\n**```!help```',
          value: 'As you can probably tell, this command is used to inform the user about the bot.',
        },
      ],
    },
  });
  if (msg.guild !== null) {
    await msg.reply('Hey there! :wave:\nCheck your DMs for information on how to interact with me!');
  }
}
