export enum SupportedPlatform {
  slack = 'slack',
  discord = 'discord',
}

// TODO: Proper casing for the SupportedPlatform enum and remove strings from the enum

export const getActivePlatform = (): SupportedPlatform => {
  if (!process.env.DISCORD_BOT_TOKEN && process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET) {
    return SupportedPlatform.slack;
  }

  if (process.env.DISCORD_BOT_TOKEN && !(process.env.SLACK_BOT_TOKEN || process.env.SLACK_SIGNING_SECRET)) {
    return SupportedPlatform.discord;
  }

  throw new Error(
    'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
  );
};
