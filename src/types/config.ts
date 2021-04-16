// Create an immutable array of config values
export const defaultConfig = {
  adminSecret: null as null,
  jobChatQueueActive: false,
  supportRequestQueueActive: false,
  supportSecret: null as null,
  teamRegistrationActive: false,
} as const;

export type DefaultConfigKeys = keyof typeof defaultConfig;
export type DefaultConfigValues = typeof defaultConfig[DefaultConfigKeys];

export type KnownConfig =
  | 'discordBotToken'
  | 'discordChannelIds'
  | 'slackBotToken'
  | 'slackSigningSecret'
  | 'slackNotificationsWebhookURL'
  | DefaultConfigKeys;
