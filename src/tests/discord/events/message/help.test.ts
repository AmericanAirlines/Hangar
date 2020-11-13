import Discord from 'discord.js';
import 'jest';
import { commands } from '../../../../discord/events/message';
import { help } from '../../../../discord/events/message/help';

jest.mock('../../../../discord');

const getHelpMsg = (): Discord.Message =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (({
    reply: jest.fn(),
    content: '!help',
    author: {
      send: jest.fn(),
      id: 'JaneSmith',
    },
    channel: { type: 'dm' },
  } as unknown) as Discord.Message);

describe('help handler', () => {
  it('will DM the user a list of commands', async () => {
    const msg = getHelpMsg();
    await help(msg);
    expect(msg.reply).not.toHaveBeenCalled();
    expect(msg.author.send).toBeCalledTimes(1);
  });

  it('will DM the user a list of commands and respond with a notification msg if the msg came from a channel', async () => {
    const msg = getHelpMsg();
    msg.channel.type = 'news';
    await help(msg);
    expect(msg.reply).toBeCalledTimes(1);
    expect(msg.author.send).toBeCalledTimes(1);
  });

  it('responds with the right number of commands', async () => {
    const msg = getHelpMsg();
    await help(msg);
    const args = (msg.author.send as jest.Mock).mock.calls[0][0];
    expect(args.embed.fields).toHaveLength(commands.length);
  });
});
