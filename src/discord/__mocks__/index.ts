import Discord from 'discord.js';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
type MockDiscordClient = DeepPartial<Discord.Client>;

export const client: MockDiscordClient = {
  user: {
    id: 'default_bot_id',
  },
};

export const setupDiscord = async (): Promise<MockDiscordClient> => Promise.resolve(client);
