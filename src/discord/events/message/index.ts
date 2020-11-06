import Discord from 'discord.js';
import ping from './ping';

const handlers: Record<string, (message: Discord.Message) => Promise<void>> = {
  ping,
};

export async function message(msg: Discord.Message): Promise<void> {
  for (let i = 0; i < Object.keys(handlers).length; i += 1) {
    const messagePattern = new RegExp(Object.keys(handlers)[i]);
    const messageHandler = handlers[messagePattern];
    if (messagePattern.test(msg.content)) {
      await messageHandler(msg);
    }
  }
}
