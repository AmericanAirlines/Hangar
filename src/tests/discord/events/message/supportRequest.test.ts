/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { createDbConnection, closeDbConnection } from '../../../testdb';
import { Config } from '../../../../entities/config';
import { supportRequest } from '../../../../discord/events/message/supportRequest';
import { SupportRequest, SupportRequestType } from '../../../../entities/supportRequest';
import { stringDictionary } from '../../../../StringDictonary';

jest.mock('../../../../discord');
const configFindToggleForKeySpy = jest.spyOn(Config, 'findToggleForKey');
let supportRequestQueueActive = false;

describe('supportRequest handler', () => {
  beforeEach(async () => {
    await createDbConnection();
    jest.resetAllMocks();
    configFindToggleForKeySpy.mockImplementation(async (key: string) => (key === 'supportRequestQueueActive' ? supportRequestQueueActive : false));
    supportRequestQueueActive = false;
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  it('will message the user to let them know they have been added to the technical support queue', async () => {
    supportRequestQueueActive = true;
    const technicalMessage = makeDiscordMessage({
      content: '!technicalSupport',
      author: {
        send: jest.fn(),
        username: 'JaneSmith',
        id: '123',
      },
    });
    await supportRequest(technicalMessage);
    expect(technicalMessage.author.send).toBeCalledTimes(1);
    expect(technicalMessage.author.send).toBeCalledWith(stringDictionary.supportAddedQueue);
  });

  it('will message the user to let them know they have been added to the idea pitch queue', async () => {
    supportRequestQueueActive = true;
    const ideaMessage = makeDiscordMessage({
      content: '!ideaPitch',
      author: {
        send: jest.fn(),
        username: 'JohnDoe',
        id: '123',
      },
    });
    await supportRequest(ideaMessage);
    expect(ideaMessage.author.send).toBeCalledTimes(1);
    expect(ideaMessage.author.send).toBeCalledWith(stringDictionary.supportAddedQueue);
  });

  it('will message the user to let them know the support team is unavailable', async () => {
    const unavailableMessage = makeDiscordMessage({
      content: '!ideaPitch',
      author: {
        send: jest.fn(),
        username: 'JohnDoe',
        id: '123',
      },
    });
    await supportRequest(unavailableMessage);
    expect(unavailableMessage.author.send).toBeCalledTimes(1);
    expect(unavailableMessage.author.send).toBeCalledWith(stringDictionary.supportNotAvailable);
  });

  it('will message the user to let them know there is something wrong with signing up for a support queue', async () => {
    supportRequestQueueActive = true;
    const errorMessage = makeDiscordMessage({
      content: '!technicalSupport',
      author: {
        send: jest.fn(),
        id: 'wasd',
      },
    });
    await supportRequest(errorMessage);
    expect(errorMessage.author.send).toBeCalledTimes(1);
    expect(errorMessage.author.send).toBeCalledWith(stringDictionary.supportError);
  });

  it('will message the user to let them know they already have a pending support request', async () => {
    supportRequestQueueActive = true;
    const newMessage = makeDiscordMessage({
      content: '!ideaPitch',
      author: {
        send: jest.fn(),
        username: 'JohnDoe',
        id: '123',
      },
    });
    const existingMessage = new SupportRequest(newMessage.author.id, 'Someone', SupportRequestType.IdeaPitch);
    await existingMessage.save();
    await supportRequest(newMessage);
    expect(newMessage.author.send).toBeCalledTimes(1);
    expect(newMessage.author.send).toBeCalledWith(stringDictionary.supportAlredyinLine);
  });
});
