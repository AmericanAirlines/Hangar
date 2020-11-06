import Discord from 'discord.js';

export async function ping(msg: Discord.Message): Promise<void> {
  await msg.reply('pong');
}
