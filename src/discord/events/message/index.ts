import Discord from 'discord.js';
import { ping } from './ping';

const handlers: Record<string, (message: Discord.Message) => Promise<void>> = {
  ping,
};

export async function message(msg: Discord.Message): Promise<void> {
  for (const [pattern, messageHandler] of Object.entries(handlers)) {
    const messagePattern = new RegExp(pattern);
    if (messagePattern.test(msg.content)) {
      await messageHandler(msg);
    }
  }
}
