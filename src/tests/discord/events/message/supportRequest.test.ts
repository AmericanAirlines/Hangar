/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { SelectQueryBuilder } from 'typeorm';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { Config } from '../../../../entities/config';
import { supportRequest, supportRequestSubCommands } from '../../../../discord/events/message/supportRequest';
import { DiscordContext } from '../../../../entities/discordContext';
import logger from '../../../../logger';
import { SupportRequest } from '../../../../entities/supportRequest';

jest.mock('../../../../discord');

const saveCtx = jest.fn();
const clearCtx = jest.fn();
const saveSupportRequest = jest.fn();
const countSupportRequest = jest.fn();

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
    return {
      save: saveSupportRequest,
    };
  }
  const { SupportRequestStatus, SupportRequestType } = jest.requireActual('../../../../entities/supportRequest');
  return { SupportRequest: MockSupportRequest, SupportRequestType, SupportRequestStatus };
});

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockReturnThis(),
};
SupportRequest.createQueryBuilder = jest
  .fn()
  .mockReturnValue((mockQueryBuilder as Partial<SelectQueryBuilder<SupportRequest>>) as SelectQueryBuilder<SupportRequest>);

jest.spyOn(logger, 'error').mockImplementation();

const configFindToggleForKeySpy = jest.spyOn(Config, 'findToggleForKey');
let supportRequestQueueActive = false;

const techMsg = makeDiscordMessage({
  content: '!technicalSupport',
  author: {
    send: jest.fn(),
    username: 'John',
    id: '123',
  },
});

const ideaMsg = makeDiscordMessage({
  content: '!ideaPitch',
  author: {
    send: jest.fn(),
    username: 'John',
    id: '123',
  },
});

const jobMsg = makeDiscordMessage({
  content: '!jobChat',
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
    countSupportRequest.mockResolvedValue(0);
    supportRequestQueueActive = false;
    techMsg.content = '!technicalSupport';
  });

  it('will notify the user that support queues are not active if the config value is false for tech support command', async () => {
    const ctx = new DiscordContext('1', '', '');
    await supportRequest(techMsg, ctx);
    expect(techMsg.author.send).toBeCalledTimes(1);
    expect(techMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!",
    );
  });

  it('will prompt the user for a name upon the user using tech support command', async () => {
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(techMsg, ctx);
    expect(techMsg.author.send).toBeCalledTimes(1);
    expect(techMsg.author.send).toBeCalledWith("Hey there :wave: before we add you to the queue, what's the name of your team's voice channel?");
  });

  it('will add the user to the db for tech support command once a name is entered', async () => {
    techMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'TechnicalSupport' };
    await supportRequestSubCommands.inputName(techMsg, ctx);
    expect(ctx.currentCommand).toBe(undefined);
    expect(ctx.nextStep).toBe(undefined);
    expect(techMsg.author.send).toBeCalledTimes(1);
    expect(techMsg.author.send).toBeCalledWith(
      ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
    );
    expect(ctx.clear).toBeCalledTimes(1);
  });

  it('will notify the user that they are already in a queue for tech support command', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(techMsg, ctx);
    expect(techMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
    );
  });

  it('will notify the user that something went wrong adding them to the queue for tech support command', async () => {
    techMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'TechnicalSupport' };
    const keyConstraintError = new Error('generic error');
    saveSupportRequest.mockRejectedValueOnce(keyConstraintError);
    await supportRequestSubCommands.inputName(techMsg, ctx);
    expect(techMsg.author.send).toBeCalledWith("**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.");
    expect(ctx.clear).toBeCalledTimes(1);
  });

  it('will notify the user that support queues are not active if the config value is false for idea pitch command', async () => {
    const ctx = new DiscordContext('1', '', '');
    await supportRequest(ideaMsg, ctx);
    expect(ideaMsg.author.send).toBeCalledTimes(1);
    expect(ideaMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!",
    );
  });

  it('will prompt the user for a team voice channel upon the user using idea pitch command', async () => {
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(ideaMsg, ctx);
    expect(ideaMsg.author.send).toBeCalledTimes(1);
    expect(ideaMsg.author.send).toBeCalledWith("Hey there :wave: before we add you to the queue, what's the name of your team's voice channel?");
  });

  it('will add the user to the db for idea pitch command once a name is entered', async () => {
    ideaMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'IdeaPitch' };
    await supportRequestSubCommands.inputName(ideaMsg, ctx);
    expect(ctx.currentCommand).toBe(undefined);
    expect(ctx.nextStep).toBe(undefined);
    expect(ideaMsg.author.send).toBeCalledTimes(1);
    expect(ideaMsg.author.send).toBeCalledWith(
      ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
    );
    expect(ctx.clear).toBeCalledTimes(1);
  });

  it('will notify the user that they are already in a queue for idea pitch command', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(ideaMsg, ctx);
    expect(ideaMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
    );
  });

  it('will notify the user that something went wrong adding them to the queue for idea pitch command', async () => {
    ideaMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'IdeaPitch' };
    const keyConstraintError = new Error('generic error');
    saveSupportRequest.mockRejectedValueOnce(keyConstraintError);
    await supportRequestSubCommands.inputName(ideaMsg, ctx);
    expect(ideaMsg.author.send).toBeCalledWith("**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.");
    expect(ctx.clear).toBeCalledTimes(1);
  });

  it('will notify the user that support queues are not active if the config value is false for job chat command', async () => {
    const ctx = new DiscordContext('1', '', '');
    await supportRequest(jobMsg, ctx);
    expect(jobMsg.author.send).toBeCalledTimes(1);
    expect(jobMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!",
    );
  });

  it('will prompt the user for a name upon the user using job chat command', async () => {
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(jobMsg, ctx);
    expect(jobMsg.author.send).toBeCalledTimes(1);
    expect(jobMsg.author.send).toBeCalledWith("Hey there :wave: before we add you to the queue, what's your name?");
  });

  it('will add the user to the db for job chat command once a name is entered', async () => {
    jobMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'JobChat' };
    await supportRequestSubCommands.inputName(jobMsg, ctx);
    expect(ctx.currentCommand).toBe(undefined);
    expect(ctx.nextStep).toBe(undefined);
    expect(jobMsg.author.send).toBeCalledTimes(1);
    expect(jobMsg.author.send).toBeCalledWith(
      ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
    );
    expect(ctx.clear).toBeCalledTimes(1);
  });

  it('will notify the user that they are already in a queue for job chat command', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    const ctx = new DiscordContext('1', '', '');
    supportRequestQueueActive = true;
    await supportRequest(jobMsg, ctx);
    expect(jobMsg.author.send).toBeCalledWith(
      "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
    );
  });

  it('will notify the user that something went wrong adding them to the queue for job chat command', async () => {
    jobMsg.content = 'John';
    const ctx = new DiscordContext('1', 'supportRequest', 'inputName');
    ctx.payload = { id: '1', suppTyping: 'JobChat' };
    const keyConstraintError = new Error('generic error');
    saveSupportRequest.mockRejectedValueOnce(keyConstraintError);
    await supportRequestSubCommands.inputName(jobMsg, ctx);
    expect(jobMsg.author.send).toBeCalledWith("**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.");
    expect(ctx.clear).toBeCalledTimes(1);
  });
});
