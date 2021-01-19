import Discord from 'discord.js';

export function botWasTagged(msg: Discord.Message): boolean {
  return Array.from(msg.mentions.users.keys()).includes(msg.client.user.id);
}
