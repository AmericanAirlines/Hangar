import 'jest';
import { getActivePlatform, SupportedPlatform } from '../../common';

describe('common getActivePlatform', () => {
  beforeEach(() => {
    delete process.env.SLACK_BOT_TOKEN;
    delete process.env.SLACK_SIGNING_SECRET;
    delete process.env.DISCORD_BOT_TOKEN;
  });
  it('returns Slack as the active platform when the respective env vars are set', () => {
    process.env.SLACK_BOT_TOKEN = '123';
    process.env.SLACK_SIGNING_SECRET = '456';
    expect(getActivePlatform()).toEqual(SupportedPlatform.slack);
  });

  it('returns Discord as the active platform when the respective env var is set', () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    expect(getActivePlatform()).toEqual(SupportedPlatform.discord);
  });

  it('throws an error when there are no required env variables set for either platform', () => {
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when only the signing secret is set for Slack', () => {
    process.env.SLACK_SIGNING_SECRET = '456';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when only the token is set for Slack', () => {
    process.env.SLACK_BOT_TOKEN = '123';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when Discord bot token and Slack signing secret are set', () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    process.env.SLACK_SIGNING_SECRET = '456';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when Discord bot token and Slack bot token are set', () => {
    process.env.DISCORD_BOT_TOKEN = '123';
    process.env.SLACK_BOT_TOKEN = '456';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });

  it('throws an error when there are env variables set for both platforms', () => {
    process.env.SLACK_BOT_TOKEN = '123';
    process.env.SLACK_SIGNING_SECRET = '456';
    process.env.DISCORD_BOT_TOKEN = '789';
    expect(getActivePlatform).toThrowError(
      'Error, must set a Slack token and signing secret OR a Discord token! (Unable to set neither or both sets of environment variables)',
    );
  });
});
