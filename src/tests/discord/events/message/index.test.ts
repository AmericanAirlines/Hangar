/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import Discord from 'discord.js';
import 'jest';
import * as ping from '../../../../discord/events/message/ping';
import { DiscordContext } from '../../../../entities/discordContext';

const pingHandlerSpy = jest.spyOn(ping, 'ping').mockImplementation();
jest.spyOn(DiscordContext, 'findOne').mockImplementation();

/* Because we need to make sure the mocks above are copied
  into`commands`, we need to import the message file below:
*/
// eslint-disable-next-line import/first
import { message } from '../../../../discord/events/message';

describe('message handler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('will respond with generic info if a matching handler cannot be found', async () => {
    const reply = jest.fn();
    const genericMessage = ({
      reply,
      author: {
        id: 'JaneSmith',
      },
    } as unknown) as Discord.Message;

    await message(genericMessage);
    expect(reply).toBeCalledTimes(1);
    expect(reply).toBeCalledWith("I'm not sure what you need, try replying with `!help` for some useful information!");
  });

  it('successfully responds to !ping requests', async () => {
    const reply = jest.fn();
    const pingMessage = ({
      reply,
      content: '!ping',
      author: {
        id: 'JaneSmith',
      },
    } as unknown) as Discord.Message;

    await message(pingMessage);
    expect(pingHandlerSpy).toBeCalledTimes(1);
    expect(reply).not.toBeCalled();
  });
});
