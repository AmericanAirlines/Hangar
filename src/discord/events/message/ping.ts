import Discord from 'discord.js';

export default async function ping(msg: Discord.Message): Promise<void> {
  await msg.reply('pong');
}
