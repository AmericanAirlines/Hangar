import { env } from '../env';

export enum SupportedPlatform {
  slack = 'slack',
  discord = 'discord',
}

// TODO: Proper casing for the SupportedPlatform enum and remove strings from the enum

export const getActivePlatform = (): SupportedPlatform => {
  if (!env.discordBotToken && env.slackBotToken && env.slackSigningSecret) {
    return SupportedPlatform.slack;
  }

  if (env.discordBotToken && !(env.slackBotToken || env.slackSigningSecret)) {
    return SupportedPlatform.discord;
  }

  throw new Error(
    'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
  );
};
