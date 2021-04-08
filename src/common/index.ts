import { env } from '../env';
import { Config } from '../entities/config';

export enum SupportedPlatform {
  slack = 'slack',
  discord = 'discord',
}

// TODO: Proper casing for the SupportedPlatform enum and remove strings from the enum

export const getActivePlatform = async (): Promise<SupportedPlatform> => {
  const discordBotToken = await Config.getValueAs('discordBotToken', 'string', false);
  if (!discordBotToken && env.slackBotToken && env.slackSigningSecret) {
    return SupportedPlatform.slack;
  }

  if (discordBotToken && !(env.slackBotToken || env.slackSigningSecret)) {
    return SupportedPlatform.discord;
  }

  throw new Error(
    'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
  );
};
