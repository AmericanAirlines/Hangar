import 'jest';
import * as common from '../../common';
import * as slackMessageUsers from '../../slack/utilities/messageUsers';
import * as discordMessageUsers from '../../discord/utilities/messageUsers';

jest.mock('../../discord');

const getActivePlatformSpy = jest.spyOn(common, 'getActivePlatform');
const slackMessageUsersSpy = jest.spyOn(slackMessageUsers, 'default').mockImplementation();
const discordMessageUsersSpy = jest.spyOn(discordMessageUsers, 'messageUsers').mockImplementation();

// eslint-disable-next-line import/first
import { sendMessage } from '../../common/messageUsers';

describe('common messageUsers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls slack messageUsers when activePlatform is Slack', async () => {
    const userIds = ['slackId'];
    const message = 'hello world';
    getActivePlatformSpy.mockReturnValue(common.SupportedPlatform.slack);

    await sendMessage(userIds, message);

    expect(slackMessageUsersSpy).toHaveBeenCalledWith(userIds, message);
  });

  it('calls slack messageUsers when activePlatform is Slack', async () => {
    const userIds = ['discordId'];
    const message = 'hello world';
    getActivePlatformSpy.mockReturnValue(common.SupportedPlatform.discord);

    await sendMessage(userIds, message);

    expect(discordMessageUsersSpy).toHaveBeenCalledWith(userIds, message);
  });
});
