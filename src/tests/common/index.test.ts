import 'jest';
import { getActivePlatform, SupportedPlatform } from '../../common';
import { Config } from '../../entities/config';

const mockConfigValues: {[id: string]: string | undefined} = {
  discordBotToken: undefined,
  slackBotToken: undefined,
  slackSigningSecret: undefined,
};

jest.mock('../../entities/Config', () => ({
  Config: {
    getValueAs: jest.fn(async (key: string) => mockConfigValues[key]),
  }
}));

const mockConfigGetValueAs = Config.getValueAs as unknown as jest.Mock;

describe('common getActivePlatform', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigValues.discordBotToken = undefined;
    mockConfigValues.slackBotToken = undefined;
    mockConfigValues.slackSigningSecret = undefined;
  });
  it('returns Slack as the active platform when both slack vars are present in Config', async() => {
    mockConfigValues.slackBotToken = 'sometoken';
    mockConfigValues.slackSigningSecret = 'somesigningsecret';
    await expect(getActivePlatform()).resolves.toEqual(SupportedPlatform.slack);
  });

  xit('returns Discord as the active platform when the respective env var is set', async () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    expect(getActivePlatform()).toEqual(SupportedPlatform.discord);
  });

  xit('returns null when there are no required env variables set for either platform', async () => {
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when only the signing secret is set for Slack', async () => {
    mockConfigValues.slackSigningSecret = 'somesigning';
    await expect(getActivePlatform()).rejects.toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set both sets of environment variables)',
      );
  });

  xit('throws an error when only the token is set for Slack', async () => {
    process.env.SLACK_BOT_TOKEN = '123';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  xit('throws an error when Discord bot token and Slack signing secret are set', async () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    process.env.SLACK_SIGNING_SECRET = '456';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  xit('throws an error when Discord bot token and Slack bot token are set', async () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    process.env.SLACK_BOT_TOKEN = '456';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  xit('throws an error when there are env variables set for both platforms', async () => {
    process.env.SLACK_BOT_TOKEN = '123';
    process.env.SLACK_SIGNING_SECRET = '456';
    process.env.DISCORD_BOT_TOKEN = '789';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });
});
