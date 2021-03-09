import Discord from 'discord.js';
import { DiscordContext } from '../../../entities/discordContext';
import { ping } from './ping';
import { supportRequest, supportRequestSubCommands } from './supportRequest';
import { client } from '../..';
import logger from '../../../logger';
import { help } from './help';
import { registerTeam, regSubCommands } from './registerTeam';
import { exit } from './exit';
import { botWasTagged } from '../../utilities/botWasTagged';
import { env } from '../../../env';

/* eslint-disable no-param-reassign */
type HandlerFn = (message: Discord.Message, context: DiscordContext) => Promise<void>;

interface Command {
  handlerId: string;
  trigger?: RegExp;
  description: string;
  readTrigger: string;
  handler: HandlerFn;
  subCommands?: SubCommands;
}

export type SubCommands = Record<string, HandlerFn>;

export const commands: Command[] = [
  {
    handlerId: 'help',
    trigger: /^!(help|h)$/i,
    description: 'Lists commands the user can use to interact with the bot',
    readTrigger: '!help or !h',
    handler: help,
  },
  {
    handlerId: 'ping',
    trigger: /^!(ping|p)$/i,
    description: 'Replies with pong',
    readTrigger: '!ping or !p',
    handler: ping,
  },
  {
    handlerId: 'ideaPitch',
    trigger: /^!(ideaPitch|ip)$/i,
    description: 'Think you have a good idea? Join a queue to come pitch to our team!',
    readTrigger: '!ideaPitch or !ip',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'technicalSupport',
    trigger: /^!(technicalSupport|ts)$/i,
    description: 'Need help with your hack? Join our tech support queue so our team can help!',
    readTrigger: '!technicalSupport or !ts',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'jobChat',
    trigger: /^!(jobChat|jc)$/i,
    description: 'Interested in joining our team? Come chat with us about Full Time and Internship opportunities!',
    readTrigger: '!jobChat or !jc',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'registerTeam',
    trigger: /^!(registerTeam|rt)$/i,
    description: 'Let us know who you’re hacking with and what you’re hacking on! There may even be prizes involved :wink:',
    readTrigger: '!registerTeam or !rt',
    handler: registerTeam,
    subCommands: regSubCommands,
  },
  {
    handlerId: 'exit',
    trigger: /^!(exit|e)$/i,
    description: 'Exits the user out of any flows they might be in (such as team registration)',
    readTrigger: '!exit or !e',
    handler: exit,
  },
];

const genericErrorMessage = "Something went wrong... please try again and come chat with our team if you're still having trouble.";

export async function message(msg: Discord.Message): Promise<void> {
  msg.content = msg.content.trim();
  // Make sure the bot doesn't respond to itself
  if (msg.author.id === client.user.id) return;

  // If not in a DM, check to make sure it's in one of the approved channels
  const botChannelIds = (env.discordChannelIds ?? '').split(',').map((id) => id.trim());
  if (msg.channel.type !== 'dm') {
    if (botChannelIds.includes(msg.channel.id) && botWasTagged(msg)) {
      // Bot was tagged in a channel it's listening to AND should respond in
      msg.reply('Hi there! :wave: I can only help from within a Direct Message. Click my name and send the message `!help` to get started!');
    }
    return;
  }

  let context = await DiscordContext.findOne(msg.author.id);
  if (!context) {
    context = new DiscordContext(msg.author.id, '', '');
  }

  let handler: HandlerFn | undefined;

  // Find a command handler matching the raw message (e.g., '!help')
  handler = commands.find((c) => msg.content.match(c.trigger))?.handler;

  // Check to see if the context has a current command
  if (!handler && context.currentCommand) {
    // The text does not match a known command && the user is in a flow (currentCommand is set)

    // Find the current command (user in flow)
    const command = commands.find((c) => c.handlerId === context.currentCommand);
    // Find matching sub command
    [, handler] = Object.entries(command.subCommands ?? {}).find(([key]) => context.nextStep === key) ?? [];
    try {
      if (handler) {
        try {
          // Invoke the matching sub command
          await handler(msg, context);
        } catch (err) {
          logger.error(err);
          throw new Error(`Error was thrown trying to handle a subcommand for message: ${msg.content}\nContext: ${JSON.stringify(context)}`);
        }
      } else {
        // Something went wrong... we didn't expect to be here :(
        throw new Error(`Discord context next step handler not found for ${context.currentCommand}`);
      }
    } catch (err) {
      await context.clear();
      logger.error(err);
      msg.reply(genericErrorMessage);
    }

    return;
  }
  // handler && !currentCommand -- normal command handler
  // handler && currentCommand -- switching commands/restarting
  // !handler && !currentCommand -- jibberish
  await context.clear();

  // Handle a root-level command
  if (handler) {
    try {
      await handler(msg, context);
    } catch (err) {
      logger.error(`Error was thrown trying to handle a command for message: ${msg.content}\nContext: ${JSON.stringify(context)}`);
      msg.reply(genericErrorMessage);
    }
    return;
  }

  msg.reply("That isn't a command I understand. Try replying with `!help` to see the full list of things I can help with!");
}
