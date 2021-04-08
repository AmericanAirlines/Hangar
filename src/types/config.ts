// Create an immutable array of config values
export const defaultConfigValues = [
  'adminSecret',
  'jobChatQueueActive',
  'supportRequestQueueActive',
  'supportSecret',
  'teamRegistrationActive',
] as const;

export type DefaultConfig = typeof defaultConfigValues[number];

export type KnownConfig = 'discordBotToken' | 'slackBotToken' | 'discordChannelIds' | DefaultConfig;
