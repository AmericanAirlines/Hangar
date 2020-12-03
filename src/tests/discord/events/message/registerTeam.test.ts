/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { registerTeam } from '../../../../discord/events/message/registerTeam';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { createDbConnection, closeDbConnection } from '../../../testdb';
import { Config } from '../../../../entities/config';
import { DiscordContext } from '../../../../entities/discordContext';

jest.mock('../../../../discord');
const configFindToggleForKeySpy = jest.spyOn(Config, 'findToggleForKey');
let teamRegistrationActive = false;

const startMsg = makeDiscordMessage({
  content: '!registerTeam',
  author: {
    send: jest.fn(),
    username: 'Joe',
    id: '123',
  },
});

describe('registerTeam handler', () => {
  beforeEach(async () => {
    await createDbConnection();
    jest.resetAllMocks();
    configFindToggleForKeySpy.mockImplementation(async (key: string) => (key === 'teamRegistrationActive' ? teamRegistrationActive : false));
    teamRegistrationActive = false;
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  it('will let the user know that team registration is not open', async () => {
    const ctx = new DiscordContext('1', '', '');
    await registerTeam(startMsg, ctx);
    expect(startMsg.author.send).toBeCalledTimes(1);
    expect(startMsg.author.send).toBeCalledWith(':warning: Team registration is not open yet. Please check back later or wait for announcements!');
  });

  it("will prompt the user for the first question's input", async () => {
    const ctx = new DiscordContext('1', '', '');
    teamRegistrationActive = true;
    await registerTeam(startMsg, ctx);
    expect(startMsg.author.send).toBeCalledTimes(2);
    expect(startMsg.author.send).toBeCalledWith(
      "Who are you hacking with? If you are hacking alone, simply write your name!\n**Be sure to input your name as well as your teammate's names in a comma-separated list (e.g. John Smith, Jane Doe, ...)!**",
    );
  });

  it("will prompt the user for the second question's input", async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'teamMembers');
    const memberMsg = makeDiscordMessage({
      content: 'me, myself',
      author: {
        send: jest.fn(),
        username: 'Joe',
        id: '123',
      },
    });
    await registerTeam(startMsg, ctx);
  });
});
