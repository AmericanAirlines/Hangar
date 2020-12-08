import 'jest';
import { exit } from '../../../../discord/events/message/exit';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';

describe('exit handler', () => {
  it('will tell the user they have been exited out of any flows', async () => {
    const send = jest.fn();
    const pingMessage = makeDiscordMessage({
      content: '!exit',
      author: {
        send,
        id: 'JaneSmith',
      },
    });

    await exit(pingMessage);
    expect(send).toBeCalledWith('You have been successfully exited out of any flows you were in!');
  });
});
