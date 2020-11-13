import Discord from 'discord.js';
import { DeepPartial } from 'typeorm';

type MockDiscordClient = DeepPartial<Discord.Client>;

export const client: MockDiscordClient = {
  user: {
    id: 'default_bot_id',
  },
};

export const setupDiscord = async (): Promise<MockDiscordClient> => Promise.resolve(client);
