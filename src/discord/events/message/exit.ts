import Discord from 'discord.js';

export async function exit(msg: Discord.Message): Promise<void> {
  await msg.author.send('You have been successfully exited out of any flows you were in!');
}
