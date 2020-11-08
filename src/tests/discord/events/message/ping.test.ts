/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import Discord from 'discord.js';
import 'jest';
import { ping } from '../../../../discord/events/message/ping';

describe('ping handler', () => {
  it("will respond with 'pong' when messaged", async () => {
    const reply = jest.fn();
    const pingMessage = ({
      reply,
    } as unknown) as Discord.Message;
    await ping(pingMessage);
    expect(reply).toBeCalledWith('pong');
  });
});
