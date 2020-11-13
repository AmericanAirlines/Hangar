/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import * as ping from '../../../../discord/events/message/ping';
import { DiscordContext } from '../../../../entities/discordContext';
import { client } from '../../../../discord';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';

const pingHandlerSpy = jest.spyOn(ping, 'ping').mockImplementation();
const mockDiscordContext = new DiscordContext('1234', '');
jest.spyOn(DiscordContext, 'findOne').mockImplementation(() => Promise.resolve(mockDiscordContext));
jest.mock('../../../../discord');

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
    const genericMessage = makeDiscordMessage({
      reply,
      content: '',
      author: {
        id: 'JaneSmith',
      },
      channel: {
        type: 'dm',
      },
    });

    await message(genericMessage);
    expect(reply).toBeCalledTimes(1);
    expect(reply).toBeCalledWith("I'm not sure what you need, try replying with `!help` for some useful information!");
  });

  it('successfully responds to !ping requests', async () => {
    const reply = jest.fn();
    const pingMessage = makeDiscordMessage({
      reply,
      content: '!ping',
      author: {
        id: mockDiscordContext.id,
      },
      channel: {
        type: 'dm',
      },
    });

    await message(pingMessage);
    expect(pingHandlerSpy).toBeCalledTimes(1);
    expect(pingHandlerSpy).toBeCalledWith(pingMessage, mockDiscordContext);
  });

  it('does not respond if the message is from itself', async () => {
    client.user.id = 'bot';

    const reply = jest.fn();
    const botMessage = makeDiscordMessage({
      reply,
      content: 'From the bot',
      author: {
        id: 'bot',
      },
    });

    await message(botMessage);
    expect(reply).not.toHaveBeenCalled();
  });

  it('does not respond if in an unapproved channel', async () => {
    const reply = jest.fn();
    const channelMessage = makeDiscordMessage({
      reply,
      content: 'In a channel',
      author: {
        id: 'someone',
      },
      channel: {
        type: 'text',
        id: '0123',
      },
    });

    await message(channelMessage);
    expect(reply).not.toHaveBeenCalled();
  });

  it('responds if in an approved channel', async () => {
    Object.defineProperty(process.env, 'DISCORD_BOT_CHANNEL_IDS', { value: '9423,  13189    ,  0123' });

    const reply = jest.fn();
    const channelMessage = makeDiscordMessage({
      reply,
      content: 'In a channel',
      author: {
        id: 'someone',
      },
      channel: {
        type: 'text',
        id: '0123',
      },
    });

    await message(channelMessage);
    expect(reply).toHaveBeenCalled();
  });
});
