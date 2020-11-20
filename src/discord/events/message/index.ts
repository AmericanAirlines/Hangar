import Discord from 'discord.js';
import { DiscordContext } from '../../../entities/discordContext';
import { ping } from './ping';
import { client } from '../..';
import logger from '../../../logger';
import { help } from './help';

interface Command {
  handlerId: string;
  trigger?: string;
  description: string;
  handler: (message: Discord.Message, context: DiscordContext) => Promise<void>;
}

export const commands: Command[] = [
  {
    handlerId: 'ping',
    trigger: '!ping',
    description: 'Replies with pong',
    handler: ping,
  },
  {
    handlerId: 'help',
    trigger: '!help',
    description: 'Lists commands the user can use to interact with the bot',
    handler: help,
  },
];

export async function message(msg: Discord.Message): Promise<void> {
  // Make sure the bot doesn't respond to itself
  if (msg.author.id === client.user.id) return;

  // If not in a DM, check to make sure it's in one of the approved channels
  const botChannelIds = (process.env.DISCORD_BOT_CHANNEL_IDS ?? '').split(',').map((id) => id.trim());
  if (msg.channel.type !== 'dm' && !botChannelIds.includes(msg.channel.id)) return;

  let context = await DiscordContext.findOne(msg.author.id);

  if (!context) {
    context = new DiscordContext(msg.author.id, '');
  }

  let command: Command | undefined;

  // Check to see if the context has a next step
  if (context.nextStep) {
    command = commands.find((c) => c.handlerId === context.nextStep);
    logger.error('Discord context next step handler not found');
  }

  // If not, try to match the content to a known trigger id
  if (!command) {
    command = commands.find((c) => c.trigger === msg.content.trim());
  }

  if (command) {
    await command.handler(msg, context);
    return;
  }

  msg.reply("I'm not sure what you need, try replying with `!help` for some useful information!");
}
