import Discord from 'discord.js';

export const client = new Discord.Client();

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

export const setupDiscord = async (token: string): Promise<Discord.Client> => {
  const readyPromise = new Promise((resolve) => {
    const readyListener = (): void => {
      resolve();
      client.off('ready', readyListener);
    };

    client.on('ready', readyListener);
  });

  await client.login(token);

  await readyPromise;

  return client;
};
