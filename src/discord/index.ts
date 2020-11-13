import Discord from 'discord.js';
import { message } from './events/message';

export const client = new Discord.Client();

// Message Listeners
client.on('message', message);

// TODO: Add additional listeners

export const setupDiscord = async (token: string): Promise<Discord.Client> => {
  const readyPromise = new Promise((resolve) => {
    const readyListener = (): void => {
      resolve();
      client.removeListener('ready', readyListener);
    };

    client.on('ready', readyListener);
  });

  await client.login(token);

  await readyPromise;

  return client;
};
