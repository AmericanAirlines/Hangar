import Discord from 'discord.js';

export const ping = async (msg: Discord.Message): Promise<void> => {
  await msg.reply('pong');
};
