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
import { stringDictionary } from '../../../StringDictionary';
import { Config } from '../../../entities/config';

/* eslint-disable no-param-reassign */
type HandlerFn = (message: Discord.Message, context: DiscordContext) => Promise<void>;

interface Command {
  handlerId: string;
  trigger?: RegExp;
  description: string;
  displayTrigger: string;
  handler: HandlerFn;
  subCommands?: SubCommands;
}

export type SubCommands = Record<string, HandlerFn>;

export const commands: Command[] = [
  {
    handlerId: 'help',
    trigger: /^!(help|h)$/i,
    description: stringDictionary.helpDescript,
    displayTrigger: '!help or !h',
    handler: help,
  },
  {
    handlerId: 'ping',
    trigger: /^!(ping|p)$/i,
    description: stringDictionary.pingDescript,
    displayTrigger: '!ping or !p',
    handler: ping,
  },
  {
    handlerId: 'ideaPitch',
    trigger: /^!(ideaPitch|ip)$/i,
    description: stringDictionary.ideaDescript,
    displayTrigger: '!ideaPitch or !ip',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'technicalSupport',
    trigger: /^!(technicalSupport|ts)$/i,
    description: stringDictionary.techDescript,
    displayTrigger: '!technicalSupport or !ts',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'jobChat',
    trigger: /^!(jobChat|jc)$/i,
    description: stringDictionary.jobDescript,
    displayTrigger: '!jobChat or !jc',
    handler: supportRequest,
    subCommands: supportRequestSubCommands,
  },
  {
    handlerId: 'registerTeam',
    trigger: /^!(registerTeam|rt)$/i,
    description: stringDictionary.registerDescript,
    displayTrigger: '!registerTeam or !rt',
    handler: registerTeam,
    subCommands: regSubCommands,
  },
  {
    handlerId: 'exit',
    trigger: /^!(exit|e)$/i,
    description: stringDictionary.exitDescript,
    displayTrigger: '!exit or !e',
    handler: exit,
  },
];

const genericErrorMessage = "Something went wrong... please try again and come chat with our team if you're still having trouble.";

export async function message(msg: Discord.Message): Promise<void> {
  msg.content = msg.content.trim();
  // Make sure the bot doesn't respond to itself
  if (msg.author.id === client.user.id) return;

  // If not in a DM, check to make sure it's in one of the approved channels
  const discordChannelIds = await Config.getValueAs('discordChannelIds', 'string', false);
  const botChannelIds = (discordChannelIds ?? '').split(',').map((id) => id.trim());
  if (msg.channel.type !== 'dm') {
    if (botChannelIds.includes(msg.channel.id) && botWasTagged(msg)) {
      // Bot was tagged in a channel it's listening to AND should respond in
      msg.reply(stringDictionary.botTaggedMsg);
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

  msg.reply(stringDictionary.botCantUnderstand);
}
