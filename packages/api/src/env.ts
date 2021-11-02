/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    sessionSecret: 'SESSION_SECRET',
    discordClientId: 'DISCORD_CLIENT_ID',
    discordClientSecret: 'DISCORD_CLIENT_SECRET',
    discordGuildId: 'DISCORD_GUILD_ID',
    appUrl: 'APP_URL',
  },
  optional: {
    databaseUser: 'DATABASE_USER',
  },
});
