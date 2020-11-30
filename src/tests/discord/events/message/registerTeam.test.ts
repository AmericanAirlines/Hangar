/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { registerTeam } from '../../../../discord/events/message/registerTeam';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { createDbConnection, closeDbConnection } from '../../../testdb';
import { Config } from '../../../../entities/config';

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

const firstMsg = makeDiscordMessage({
  content: '12345',
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
    await registerTeam(startMsg);
    expect(startMsg.author.send).toBeCalledTimes(1);
    expect(startMsg.author.send).toBeCalledWith(
      "**Registration Not Open**\n:warning: Team registration is not open yet. Check back later or, if you're subscribed to updates, watch for a direct message from the bot!",
    );
  });

  it("will prompt the user for the first question's input", async () => {
    teamRegistrationActive = true;
    await registerTeam(startMsg);
    expect(startMsg.author.send).toBeCalledTimes(2);
  });
});
