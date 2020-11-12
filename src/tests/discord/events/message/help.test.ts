import Discord from 'discord.js';
import 'jest';
import { help } from '../../../../discord/events/message/help';

describe('help handler', () => {
  it('will DM the user a list of commands and respond with a notification msg if the msg came form a channel', async () => {
    const reply = jest.fn();
    const send = jest.fn();
    const getHelp = ({
      reply,
      content: '!help',
      author: {
        send,
        id: 'JaneSmith',
      },
    } as unknown) as Discord.Message;

    await help(getHelp);
    expect(reply).toBeCalledTimes(1);
    expect(send).toBeCalledTimes(1);
  });
});
