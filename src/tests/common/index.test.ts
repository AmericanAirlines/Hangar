import 'jest';
import { getActivePlatform, SupportedPlatform } from '../../common';

const mockConfigValues: { [id: string]: string | undefined } = {
  discordBotToken: undefined,
  slackBotToken: undefined,
  slackSigningSecret: undefined,
};

jest.mock('../../entities/config', () => ({
  Config: {
    getValueAs: jest.fn(async (key: string) => mockConfigValues[key]),
  },
}));

describe('common getActivePlatform', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigValues.discordBotToken = undefined;
    mockConfigValues.slackBotToken = undefined;
    mockConfigValues.slackSigningSecret = undefined;
  });
  it('returns Slack as the active platform when both slack vars are present in Config', async () => {
    mockConfigValues.slackBotToken = 'sometoken';
    mockConfigValues.slackSigningSecret = 'somesigningsecret';
    await expect(getActivePlatform()).resolves.toEqual(SupportedPlatform.slack);
  });

  it('returns Discord as the active platform when the respective env var is set', async () => {
    mockConfigValues.discordBotToken = '123';
    await expect(getActivePlatform()).resolves.toEqual(SupportedPlatform.discord);
  });

  it('returns null when there are no required env variables set for either platform', async () => {
    await expect(getActivePlatform()).resolves.toEqual(null);
  });

  it('throws an error when only the signing secret is set for Slack', async () => {
    mockConfigValues.slackSigningSecret = 'somesigning';
    await expect(getActivePlatform()).rejects.toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set both sets of environment variables)',
    );
  });

  it('throws an error when only the token is set for Slack', async () => {
    mockConfigValues.slackBotToken = 'sometoken';
    await expect(getActivePlatform()).rejects.toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set both sets of environment variables)',
    );
  });

  it('throws an error when Discord bot token and Slack signing secret are set', async () => {
    mockConfigValues.slackSigningSecret = 'somesecret';
    mockConfigValues.discordBotToken = '123';
    await expect(getActivePlatform()).rejects.toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set both sets of environment variables)',
    );
  });

  it('throws an error when Discord bot token and Slack bot token are set', async () => {
    mockConfigValues.slackBotToken = 'sometoken';
    mockConfigValues.discordBotToken = '123';
    await expect(getActivePlatform()).rejects.toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set both sets of environment variables)',
    );
  });
});
