import Discord from 'discord.js';
import { DiscordContext } from '../../../entities/discordContext';
import { ping } from './ping';
import { client } from '../..';
import logger from '../../../logger';
import { help } from './help';
import { registerTeam, regSubCommands } from './registerTeam';

type HandlerFn = (message: Discord.Message, context: DiscordContext) => Promise<void>;

interface Command {
  handlerId: string;
  trigger?: string;
  description: string;
  handler: HandlerFn;
  subCommands?: SubCommands;
}

export type SubCommands = Record<string, HandlerFn>;

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
  {
    handlerId: 'registerTeam',
    trigger: '!registerTeam',
    description: 'Leads the user through the process of registering a team',
    handler: registerTeam,
    subCommands: regSubCommands,
  },
];

export async function message(msg: Discord.Message): Promise<void> {
  // Make sure the bot doesn't respond to itself
  if (msg.author.id === client.user.id) return;

  let context: DiscordContext; // move back to line 53 when done

  // If not in a DM, check to make sure it's in one of the approved channels
  const botChannelIds = (process.env.DISCORD_BOT_CHANNEL_IDS ?? '').split(',').map((id) => id.trim());
  if (msg.channel.type !== 'dm' && !botChannelIds.includes(msg.channel.id)) return;
  try {
    context = await DiscordContext.findOne(msg.author.id);
  } catch (err) {
    console.log('one');
  }

  if (!context) {
    context = new DiscordContext(msg.author.id, '', '');
  }

  let handler: HandlerFn | undefined;

  // Find a command handler matching the raw message (e.g., '!help')
  handler = commands.find((c) => c.trigger === msg.content.trim())?.handler;

  // Check to see if the context has a current command
  if (!handler && context.currentCommand) {
    // The text does not match a known command && the user is in a flow (currentCommand is set)

    // Find the current command (user in flow)
    const command = commands.find((c) => c.handlerId === context.currentCommand);
    console.log(command);
    // Find matching sub command
    [, handler] = Object.entries(command.subCommands ?? {}).find(([key]) => context.nextStep === key);

    if (handler) {
      // Invoke the matching sub command
      try {
        await handler(msg, context);
      } catch (err) {
        console.log('two');
      }
    } else {
      // Something went wrong... we didn't expect to be here :(
      logger.error(`Discord context next step handler not found for ${context.currentCommand}`);
      try {
        await context.clear();
      } catch (err) {
        console.log('three');
      }
      msg.reply("Something went wrong... please try again and come chat with our team if you're still having trouble.");
      return;
    }
  } else {
    // handler && !currentCommand -- normal command handler
    // handler && currentCommand -- switching commands/restarting
    // !handler && !currentCommand -- jibberish
    try {
      await context.clear();
    } catch (err) {
      console.log('four');
    }
  }

  if (handler) {
    try {
      await handler(msg, context);
    } catch (err) {
      console.log('five');
    }
    return;
  }
  msg.reply("I'm not sure what you need, try replying with `!help` for some useful information!");
}
