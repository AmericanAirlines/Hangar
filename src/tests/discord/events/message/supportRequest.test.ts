/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { Config } from '../../../../entities/config';
import { supportRequest, suppSubCommands } from '../../../../discord/events/message/supportRequest';
import { SupportRequest, SupportRequestType } from '../../../../entities/supportRequest';
import { DiscordContext } from '../../../../entities/discordContext';
import logger from '../../../../logger';

jest.mock('../../../../discord');

const saveCtx = jest.fn();
const clearCtx = jest.fn();

jest.mock('../../../../entities/discordContext', () => {
  function MockDiscordContext(): object {
    return {
      save: saveCtx,
      clear: clearCtx,
    };
  }
  return { DiscordContext: MockDiscordContext };
});

jest.mock('../../../../entities/supportRequest', () => {
  function MockSupportRequest(): object {
    return {};
  }
  return { SupportRequest: MockSupportRequest };
});

jest.mock('../../../../entities/supportRequest', () => {
  function MockSupportRequestType(): object {
    return {};
  }
  return { SupportRequestType: MockSupportRequestType, suppTyping: jest.mock };
});

jest.spyOn(logger, 'error').mockImplementation();

const configFindToggleForKeySpy = jest.spyOn(Config, 'findToggleForKey');
let supportRequestQueueActive = false;

const baseMsg = makeDiscordMessage({
  content: '!technicalSupport',
  author: {
    send: jest.fn(),
    username: 'John',
    id: '123',
  },
});

describe('supportRequest handler', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    configFindToggleForKeySpy.mockImplementation(async (key: string) => (key === 'supportRequestQueueActive' ? supportRequestQueueActive : false));
    supportRequestQueueActive = false;
    baseMsg.content = '!technicalSupport';
  });

  it('will notify the user that support queues are not active if the config value is false for a support request command', async () => {
    const ctx = new DiscordContext('1', '', '');
    await supportRequest(baseMsg, ctx);
    expect(baseMsg.author.send).toBeCalledTimes(1);
    expect(baseMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!",
    );
  });

  it('will prompt the user for a name upon the user using a support request command', async () => {
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(baseMsg, ctx);
    expect(baseMsg.author.send).toBeCalledTimes(1);
    expect(baseMsg.author.send).toBeCalledWith('Hello :wave:, welcome to the queue! Please input your name to join the queue!');
  });

  it('will add the user to the db for a support request command once a name is entered', async () => {
    baseMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'TechnicalSupport' };
    await suppSubCommands.inputName(baseMsg, ctx);
    expect(ctx.currentCommand).toBe(undefined);
    expect(ctx.nextStep).toBe(undefined);
    expect(baseMsg.author.send).toBeCalledTimes(1);
    expect(baseMsg.author.send).toBeCalledWith(
      ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
    );
    expect(ctx.payload).toStrictEqual({});
  });

  it('will notify the user that they are already in a queue for a support request command', async () => {
    baseMsg.content = 'Jim';
  });

  it('will notify the user that something went wrong adding them to the queue for a support request command', async () => {
    baseMsg.content = 'Jim';
  });
});
