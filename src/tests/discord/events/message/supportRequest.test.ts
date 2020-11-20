/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { supportRequest } from '../../../../discord/events/message/supportRequest';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { createDbConnection, closeDbConnection } from '../../../testdb';
import { Config } from '../../../../entities/config';

jest.mock('../../../../discord');

describe('supportRequest handler', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  it('will message the user to let them know they have been added to the technical support queue', async () => {
    const send = jest.fn();

    const technicalMessage = makeDiscordMessage({
      content: '!technicalSupport',
      author: {
        send,
        id: 'JaneSmith',
      },
    });
    await supportRequest(technicalMessage);
    expect(technicalMessage.author.send).toBeCalledTimes(1);
  });

  it('will message the user to let them know they have been added to the idea pitch queue', async () => {
    const send = jest.fn();

    const ideaMessage = makeDiscordMessage({
      content: '!ideaPitch',
      author: {
        send,
        id: 'JohnDoe',
      },
    });
    await supportRequest(ideaMessage);
    expect(ideaMessage.author.send).toBeCalledTimes(1);
  });
});
