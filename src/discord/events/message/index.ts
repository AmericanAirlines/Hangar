import Discord from 'discord.js';
import { DiscordContext } from '../../../entities/discordContext';
import { ping } from './ping';

interface Command {
  handlerId: string;
  trigger?: string;
  description: string;
  handler: (message: Discord.Message) => Promise<void>;
}

export const commands: Command[] = [
  {
    handlerId: 'ping',
    trigger: '!ping',
    description: 'Replies with pong',
    handler: ping,
  },
];

export async function message(msg: Discord.Message): Promise<void> {
  const context = await DiscordContext.findOne(msg.author.id);

  //   if (!context) {
  //     context = new DiscordContext()
  //   }

  // Check to see if the context has a next step
  let command = commands.find((c) => c.handlerId === context?.nextStep);

  if (command) {
    await command.handler(msg);
    return;
  }

  // If not, try to match the content to a known trigger id
  command = commands.find((c) => c.trigger === msg.content);

  if (command) {
    await command.handler(msg);
    return;
  }

  msg.reply("I'm not sure what you need, try replying with `!help` for some useful information!");
}
