import { Router } from 'express';
import { Client, Intents } from 'discord.js';
import logger from '../logger';
import { env } from '../env';
import { populateUser } from '../middleware/populateUser';

export const discord = Router();

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

discord.use(populateUser());

export async function messageUsers(userId: string, message: string): Promise<void> {
  await client.login(env.discordBotToken);
  client.on('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
  });
  const user = await client.users.fetch(userId).catch(() => null);

  if (user) {
    try {
      await user.send(message);
    } catch (e) {
      logger.error('Unable to dm user', e);
    }
  }
}

discord.post('/dm', async (req, res) => {
  try {
    if (!req.userEntity.isAdmin) {
      res.status(403).send('Not authorized to perform this action');
    }

    await messageUsers(req.body.userId, req.body.message);
    res.status(200);
  } catch (error) {
    logger.error('There was an issue getting events', error);
    res.status(500).send('There was an issue getting events');
  }
});
