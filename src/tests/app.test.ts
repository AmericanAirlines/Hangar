import 'jest';
import supertest from 'supertest';
import logger from '../logger';
import { env } from '../env';
import { Config } from '../entities/config'

jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();

// eslint-disable-next-line import/first
import { app, initSlack, initDiscord } from '../app';

jest.mock('../discord');
jest.mock('../env', () => {
  const realEnv = jest.requireActual('../env');
  return {
    env: {
      ...realEnv,
      adminSecret: 'iAdmin',
      nodeEnv: 'development',
    },
  };
});

// jest.mock('../entities/config', () => ({
//   Config: {
//     getValueAs: jest.fn(async (key: string) => mockConfigValues[key]),
//   }
// }));

const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
const mockSlackAuth = jest.fn();
jest.mock('@slack/web-api', () => ({
  // eslint-disable-next-line object-shorthand, func-names, @typescript-eslint/explicit-function-return-type, space-before-function-paren
  WebClient: function() {
    return {
      auth: {
        test: mockSlackAuth,
      },
    };
  },
}));

describe('app', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSlackAuth.mockRejectedValue('Invalid Auth');
  });

  it('responds successfully to GET /', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });

  it('will exit the process when Slack tokens are not provided and NODE_ENV !== "test", because it cannot initialize Slack', async () => {
    await initSlack();
    expect(processExitSpy).toBeCalledTimes(1);
  });

  it('will not exit the process when Slack tokens are not provided and the NODE_ENV is "test"', (done) => {
    jest.isolateModules(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (env as any).nodeEnv = 'test';
      // eslint-disable-next-line global-require
      const isolatedInitSlack = require('../app').initSlack;
      await isolatedInitSlack();
      expect(processExitSpy).not.toBeCalled();
      done();
    });
  });

  it('will initialize correctly when provided with a valid token', (done) => {
    jest.isolateModules(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (env as any).slackBotToken = '123';
      mockSlackAuth.mockResolvedValueOnce('Valid Auth');
      // eslint-disable-next-line global-require
      const isolatedInitSlack = require('../app').initSlack;
      await isolatedInitSlack();
      expect(loggerInfoSpy.mock.calls[loggerInfoSpy.mock.calls.length - 1][0]).toEqual('Slack app initialized successfully');
      done();
    });
  });

  it('will not initialize Discord if missing the bot token', async () => {
    await initDiscord();
    expect(loggerInfoSpy.mock.calls[loggerInfoSpy.mock.calls.length - 1][0]).toEqual('Discord skipped (missing DISCORD_BOT_TOKEN)');
  });

  it('will exit the process when Discord tokens are provided but setup fails, and NODE_ENV !== "test", because it cannot initialize Discord', (done) => {
    jest.isolateModules(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (env as any).discordBotToken = '123';
      jest.resetModules();
      jest.mock('../discord', () => ({
        setupDiscord: (): Promise<Error> => Promise.reject(new Error()),
      }));
      // eslint-disable-next-line global-require
      const isolatedInitDiscord = require('../app').initSlack;
      await isolatedInitDiscord();
      expect(processExitSpy).toBeCalledTimes(1);
      done();
    });
  });
});
