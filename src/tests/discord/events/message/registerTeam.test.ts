/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import { registerTeam, regSubCommands } from '../../../../discord/events/message/registerTeam';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import { Config } from '../../../../entities/config';
import { DiscordContext } from '../../../../entities/discordContext';

jest.mock('../../../../discord');

const configFindToggleForKeySpy = jest.spyOn(Config, 'findToggleForKey');

const saveCtx = jest.fn();
const clearCtx = jest.fn();
const saveTeam = jest.fn();
const findTeam = jest.fn();

jest.mock('../../../../entities/discordContext', () => {
  function MockDiscordContext(): object {
    return {
      save: saveCtx,
      clear: clearCtx,
    };
  }

  return { DiscordContext: MockDiscordContext };
});

jest.mock('../../../../entities/team', () => {
  function MockTeam(): object {
    return {
      save: saveTeam,
      find: findTeam,
    };
  }

  return { Team: MockTeam };
});

interface DbError extends Error {
  code: string;
}

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
    jest.resetAllMocks();
    jest.resetModules();
    configFindToggleForKeySpy.mockImplementation(async (key: string) => (key === 'teamRegistrationActive' ? teamRegistrationActive : false));
    teamRegistrationActive = false;
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

  it('will call the subCommand dealing with team members', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'teamMembers');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const memberList = 'me, myself';
    const memberMsg = makeDiscordMessage({
      content: memberList,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    await regSubCommands.teamMembers(memberMsg, ctx);
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(send).toBeCalledWith("What's your team or app name?");
    expect(ctx.nextStep).toBe('teamName');
    expect(ctx.payload).toStrictEqual({ members: ['me', 'myself'] });
  });

  it('will call the subCommand dealing with team name', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'teamName');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const teamName = 'Jane';
    const nameMsg = makeDiscordMessage({
      content: teamName,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    await regSubCommands.teamName(nameMsg, ctx);
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(send).toBeCalledWith('What does your project do? How will it make a difference? What technologies are used?');
    expect(ctx.nextStep).toBe('teamDescription');
    expect(ctx.payload).toStrictEqual({ name: teamName });
  });

  it('will call the subCommand dealing with team description', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'teamDescription');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const descript = 'does stuff';
    const descMsg = makeDiscordMessage({
      content: descript,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    await regSubCommands.teamDescription(descMsg, ctx);

    expect(send).toBeCalledWith("What's your table number (e.g. 42)?");
    expect(ctx.payload).toStrictEqual({ description: descript });
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(ctx.nextStep).toBe('tableNumber');
  });

  it('will call the subCommand dealing with table number', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'tableNumber');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const tableNum = '22';
    const numMsg = makeDiscordMessage({
      content: tableNum,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    await regSubCommands.tableNumber(numMsg, ctx);
    const [msg] = send.mock.calls[0];
    expect(msg.embed.title === '**You are signed up :partying_face:**').toBeTruthy();
    expect(ctx.payload).toStrictEqual({ table: parseInt(tableNum, 10) });
    expect(ctx.currentCommand).toBe(undefined);
    expect(ctx.nextStep).toBe(undefined);
  });

  it('will let the user know that what the entered is NaN', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'tableNumber');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const tableNum = 'abc';
    const numMsg = makeDiscordMessage({
      content: tableNum,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    await regSubCommands.tableNumber(numMsg, ctx);
    expect(send).toBeCalledWith('Oops, looks like the table number you entered is not a number! Please try again.');
    expect(ctx.payload).toEqual({});
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(ctx.nextStep).toBe('tableNumber');
  });

  it('will let the user know that someone has already signed up for the table they entered', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'tableNumber');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const tableNum = '2';
    const convertedNum = parseInt(tableNum, 10);
    const numMsg = makeDiscordMessage({
      content: tableNum,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    const keyConstraintError = new Error('table num taken');
    (keyConstraintError as DbError).code = '23505';
    saveTeam.mockRejectedValueOnce(keyConstraintError);
    await regSubCommands.tableNumber(numMsg, ctx);
    expect(send).toBeCalledWith('Oops, looks like someone already entered the table that you input! Please try again');
    expect(ctx.payload).toEqual({ table: convertedNum });
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(ctx.nextStep).toBe('tableNumber');
  });

  it('will let the user know that someone has already signed up for the table they entered', async () => {
    const ctx = new DiscordContext('1', 'registerTeam', 'tableNumber');
    const send = jest.fn();
    ctx.payload = {};
    teamRegistrationActive = true;
    const tableNum = '2';
    const convertedNum = parseInt(tableNum, 10);
    const numMsg = makeDiscordMessage({
      content: tableNum,
      author: {
        send,
        username: 'Joe',
        id: '123',
      },
    });
    const keyConstraintError = new Error('generic error');
    saveTeam.mockRejectedValueOnce(keyConstraintError);
    await regSubCommands.tableNumber(numMsg, ctx);
    expect(send).toBeCalledWith('Oops, looks like something went wrong on our end! Come to our booth and we will try to sort things out.');
    expect(ctx.payload).toEqual({ table: convertedNum });
    expect(ctx.currentCommand).toBe('registerTeam');
    expect(ctx.nextStep).toBe('tableNumber');
  });
});
