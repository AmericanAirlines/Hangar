import { Config } from '../entities/config';

export enum SupportedPlatform {
  slack = 'slack',
  discord = 'discord',
}

// TODO: Proper casing for the SupportedPlatform enum and remove strings from the enum

export const getActivePlatform = async (): Promise<SupportedPlatform | null> => {
  const slackBotToken = await Config.getValueAs('slackBotToken', 'string', false);
  const slackSigningSecret = await Config.getValueAs('slackSigningSecret', 'string', false);
  const discordBotToken = await Config.getValueAs('discordBotToken', 'string', false);

  if (!discordBotToken && slackBotToken && slackSigningSecret) {
    return SupportedPlatform.slack;
  }

  if (discordBotToken && !(slackBotToken || slackSigningSecret)) {
    return SupportedPlatform.discord;
  }

  if (!discordBotToken && !slackBotToken && !slackSigningSecret) {
    return null;
  }

  throw new Error(
    'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
  );
};
