/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { ping } from '../../../../discord/events/message/ping';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';

describe('ping handler', () => {
  it("will respond with 'pong' when messaged", async () => {
    const reply = jest.fn();
    const pingMessage = makeDiscordMessage({
      reply,
      content: '!ping',
      author: {
        id: 'JaneSmith',
      },
    });

    await ping(pingMessage);
    expect(reply).toBeCalledWith('pong');
  });
});
