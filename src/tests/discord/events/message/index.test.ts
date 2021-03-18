/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import 'jest';
import * as ping from '../../../../discord/events/message/ping';
import * as support from '../../../../discord/events/message/supportRequest';
import * as register from '../../../../discord/events/message/registerTeam';
import * as exit from '../../../../discord/events/message/exit';
import { DiscordContext } from '../../../../entities/discordContext';
import { client } from '../../../../discord';
import { makeDiscordMessage } from '../../../utilities/makeDiscordMessage';
import logger from '../../../../logger';
import * as botWasTagged from '../../../../discord/utilities/botWasTagged';
import { env } from '../../../../env';
import { stringDictionary } from '../../../../StringDictionary';

// Mock all the handlers - we don't care about testing their implementation
const pingHandlerSpy = jest.spyOn(ping, 'ping').mockImplementation();
const mockHelpHandler = jest.fn();
jest.mock('../../../../discord/events/message/help', () => ({ help: jest.fn((...args) => mockHelpHandler(...args)) }));
const supportHandlerSpy = jest.spyOn(support, 'supportRequest').mockImplementation();
jest.spyOn(register, 'registerTeam').mockImplementation();
const exitHandlerSpy = jest.spyOn(exit, 'exit').mockImplementation();
const teamNameSpy = jest.spyOn(register.regSubCommands, 'teamName').mockImplementation();

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const botWasTaggedSpy = jest.spyOn(botWasTagged, 'botWasTagged').mockReturnValue(false);
const mockDiscordContext = new DiscordContext('1234', '', '');
jest.mock('../../../../discord');
jest.mock('../../../../env', () => {
  const realEnv = jest.requireActual('../../../../env');
  return {
    env: {
      ...realEnv,
      discordChannelIds: '9423,  13189    ,  0123',
    },
  };
});

const discordContextFindOneMock = jest.fn(async () => mockDiscordContext);
jest.mock('../../../../entities/discordContext', () => {
  function MockedDiscordContext(id: string, currentCommand: string, nextStep: string): object {
    return {
      id,
      currentCommand,
      nextStep,
      payload: {},
      clear: jest.fn(),
    };
  }

  MockedDiscordContext.findOne = jest.fn(async () => discordContextFindOneMock());

  return {
    DiscordContext: MockedDiscordContext,
  };
});

/* Because we need to make sure the mocks above are copied
  into`commands`, we need to import the message file below:
*/
// eslint-disable-next-line import/first
import { message } from '../../../../discord/events/message';

describe('message handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(reply).toBeCalledWith(stringDictionary.botCantUnderstand);
  });

  it('successfully responds to !H requests', async () => {
    const reply = jest.fn();
    const helpMessage = makeDiscordMessage({
      reply,
      content: '!H',
      author: {
        id: mockDiscordContext.id,
      },
      channel: {
        type: 'dm',
      },
    });

    await message(helpMessage);
    expect(mockHelpHandler).toBeCalledTimes(1);
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
  });

  it('will respond with generic info for !ideaPitchs', async () => {
    const reply = jest.fn();
    const genericMessage = makeDiscordMessage({
      reply,
      content: '!ideaPitchs',
      author: {
        id: 'JaneSmith',
      },
      channel: {
        type: 'dm',
      },
    });

    await message(genericMessage);
    expect(reply).toBeCalledTimes(1);
    expect(reply).toBeCalledWith(stringDictionary.botCantUnderstand);
  });

  it('successfully responds to !ts requests', async () => {
    const reply = jest.fn();
    const supportMessage = makeDiscordMessage({
      reply,
      content: '!ts',
      author: {
        id: mockDiscordContext.id,
      },
      channel: {
        type: 'dm',
      },
    });

    await message(supportMessage);
    expect(supportHandlerSpy).toBeCalledTimes(1);
  });

  it('successfully responds to !JOBchat requests', async () => {
    const reply = jest.fn();
    const supportMessage = makeDiscordMessage({
      reply,
      content: '!JOBchat',
      author: {
        id: mockDiscordContext.id,
      },
      channel: {
        type: 'dm',
      },
    });

    await message(supportMessage);
    expect(supportHandlerSpy).toBeCalledTimes(1);
  });

  it('will respond with generic info for !RegisterTeams', async () => {
    const reply = jest.fn();
    const genericMessage = makeDiscordMessage({
      reply,
      content: '!RegisterTeams',
      author: {
        id: 'JaneSmith',
      },
      channel: {
        type: 'dm',
      },
    });

    await message(genericMessage);
    expect(reply).toBeCalledTimes(1);
    expect(reply).toBeCalledWith(stringDictionary.botCantUnderstand);
  });

  it('successfully responds to !e requests', async () => {
    const reply = jest.fn();
    const exitMessage = makeDiscordMessage({
      reply,
      content: '!e',
      author: {
        id: mockDiscordContext.id,
      },
      channel: {
        type: 'dm',
      },
    });

    await message(exitMessage);
    expect(exitHandlerSpy).toBeCalledTimes(1);
  });

  it('logs an error if a handler throws', async () => {
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

    pingHandlerSpy.mockRejectedValueOnce(new Error('Something went wrong!'));
    await message(pingMessage);
    expect(pingHandlerSpy).toBeCalledTimes(1);
    expect(loggerErrorSpy).toBeCalled();
    expect(reply).toBeCalledWith("Something went wrong... please try again and come chat with our team if you're still having trouble.");
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
        id: '456',
      },
    });

    await message(channelMessage);
    expect(reply).not.toHaveBeenCalled();
  });

  it('responds if notified of message in monitored channel and was tagged', async () => {
    botWasTaggedSpy.mockReturnValueOnce(true);
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

  it('does not respond if notified of message in monitored channel and was NOT tagged', async () => {
    const reply = jest.fn();
    const channelMessage = makeDiscordMessage({
      reply,
      content: 'In a channel',
      author: {
        id: 'someone',
      },
      channel: {
        type: 'text',
        id: '456',
      },
    });

    await message(channelMessage);
    expect(reply).not.toHaveBeenCalled();
  });

  it('does not respond if there are no set monitored channels', (done) => {
    jest.isolateModules(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (env as any).discordChannelIds = undefined;
      const reply = jest.fn();
      const channelMessage = makeDiscordMessage({
        reply,
        content: 'In a channel',
        author: {
          id: 'someone',
        },
        channel: {
          type: 'text',
          id: '456',
        },
      });
      // eslint-disable-next-line global-require
      const isolatedMessage = require('../../../../discord/events/message/index').message;
      await isolatedMessage(channelMessage);
      expect(reply).not.toHaveBeenCalled();
      done();
    });
  });

  it('will invoke a subcommand if context has a currentCommand', async () => {
    (DiscordContext.findOne as jest.Mock).mockResolvedValueOnce({
      currentCommand: 'registerTeam',
      nextStep: 'teamName',
      payload: {},
    });

    const reply = jest.fn();

    await message(
      makeDiscordMessage({
        reply,
        content: 'Something mid flow!',
        author: {
          id: 'JaneSmith',
        },
        channel: {
          type: 'dm',
        },
      }),
    );
    expect(teamNameSpy).toBeCalled();
  });

  it('will log an error if a subcommand throws', async () => {
    // const ctx = new DiscordContext('JaneSmith', 'registerTeam', 'teamName');
    const ctxClear = jest.fn();
    (DiscordContext.findOne as jest.Mock).mockResolvedValueOnce({
      currentCommand: 'registerTeam',
      nextStep: 'teamName',
      clear: ctxClear,
    });

    const reply = jest.fn();

    teamNameSpy.mockRejectedValueOnce(new Error('Something went wrong'));
    await message(
      makeDiscordMessage({
        reply,
        content: 'Something mid flow!',
        author: {
          id: 'JaneSmith',
        },
        channel: {
          type: 'dm',
        },
      }),
    );
    expect(teamNameSpy).toBeCalled();
    expect(loggerErrorSpy).toBeCalledTimes(2);
    expect(ctxClear).toBeCalled();
    expect(reply).toBeCalledWith("Something went wrong... please try again and come chat with our team if you're still having trouble.");
  });

  it("will log an error if a matching subcommand can't be found", async () => {
    // const ctx = new DiscordContext('JaneSmith', 'registerTeam', 'teamName');
    (DiscordContext.findOne as jest.Mock).mockResolvedValueOnce({
      currentCommand: 'registerTeam',
      nextStep: 'junk',
      clear: jest.fn(),
    });

    const reply = jest.fn();

    await message(
      makeDiscordMessage({
        reply,
        content: 'Something mid flow!',
        author: {
          id: 'JaneSmith',
        },
        channel: {
          type: 'dm',
        },
      }),
    );
    expect(loggerErrorSpy).toBeCalledTimes(1);
    expect(reply).toBeCalledWith("Something went wrong... please try again and come chat with our team if you're still having trouble.");
  });

  it('will log an error if the current command has no subcommands', async () => {
    // const ctx = new DiscordContext('JaneSmith', 'registerTeam', 'teamName');
    (DiscordContext.findOne as jest.Mock).mockResolvedValueOnce({
      currentCommand: 'ping',
      nextStep: 'junk',
      clear: jest.fn(),
    });

    const reply = jest.fn();

    await message(
      makeDiscordMessage({
        reply,
        content: 'Something mid flow!',
        author: {
          id: 'JaneSmith',
        },
        channel: {
          type: 'dm',
        },
      }),
    );
    expect(loggerErrorSpy).toBeCalledTimes(1);
    expect(reply).toBeCalledWith("Something went wrong... please try again and come chat with our team if you're still having trouble.");
  });

  it('will create a context if none exists', async () => {
    (DiscordContext.findOne as jest.Mock).mockImplementation(async () => null);
    const discordId = 'discordId';

    await message(
      makeDiscordMessage({
        reply: jest.fn(),
        content: '',
        author: { id: discordId },
        channel: {
          type: 'dm',
          id: '0123',
        },
      }),
    );

    // TODO: Fix this to actually make sure the constructor was called
    // expect(DiscordContext).toHaveBeenCalledWith(discordId, '', '');
  });
});
