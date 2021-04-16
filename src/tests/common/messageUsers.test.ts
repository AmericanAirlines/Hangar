/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import 'jest';
import { WebClient } from '@slack/web-api';
import * as common from '../../common';
import * as slackMessageUsers from '../../slack/utilities/messageUsers';
import * as discordMessageUsers from '../../discord/utilities/messageUsers';
import { Config } from '../../entities/config';

jest.mock('../../discord');

const getActivePlatformSpy = jest.spyOn(common, 'getActivePlatform');
const slackMessageUsersSpy = jest.spyOn(slackMessageUsers, 'default').mockImplementation();
const discordMessageUsersSpy = jest.spyOn(discordMessageUsers, 'messageUsers').mockImplementation();

const mockSlackBotToken = 'tokenTest';
jest.mock('../../entities/config', () => ({
  Config: {
    getValueAs: jest.fn(async () => mockSlackBotToken),
  },
}));

jest.mock('@slack/web-api');

describe('common messageUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the slack message implementation when activePlatform is Slack and slackClient already exists', async () => {
    const userIds = ['slackId'];
    const message = 'hello world';
    getActivePlatformSpy.mockResolvedValueOnce(common.SupportedPlatform.slack);

    jest.isolateModules(async () => {
      const { sendMessage } = require('../../common/messageUsers');

      await sendMessage(userIds, message);
      expect(discordMessageUsersSpy).not.toBeCalled();
      expect(slackMessageUsersSpy).toBeCalledWith(((WebClient as unknown) as jest.Mock).mock.instances[0], userIds, message);
      expect(slackMessageUsersSpy).toBeCalledTimes(1);
      expect(Config.getValueAs).toBeCalledWith('slackBotToken', 'string', true);
      expect(WebClient).toBeCalledWith(mockSlackBotToken);
    });
  });

  it('uses a cached slack client', async () => {
    const userIds = ['slackId'];
    const message = 'hello world';
    getActivePlatformSpy.mockResolvedValueOnce(common.SupportedPlatform.slack).mockResolvedValueOnce(common.SupportedPlatform.slack);

    jest.isolateModules(async () => {
      const { sendMessage } = require('../../common/messageUsers');
      await sendMessage(userIds, message);
      await sendMessage(userIds, message);
      expect(WebClient).toBeCalledTimes(1);
      expect(slackMessageUsersSpy).toBeCalledTimes(2);
    });
  });

  it('calls discord messageUsers when activePlatform is Discord', async () => {
    const userIds = ['discordId'];
    const message = 'hello world';
    getActivePlatformSpy.mockResolvedValueOnce(common.SupportedPlatform.discord);

    jest.isolateModules(async () => {
      const { sendMessage } = require('../../common/messageUsers');
      await sendMessage(userIds, message);
      expect(discordMessageUsersSpy).toBeCalledWith(userIds, message);
      expect(discordMessageUsersSpy).toBeCalledTimes(1);
      expect(slackMessageUsersSpy).not.toBeCalled();
    });
  });
});
