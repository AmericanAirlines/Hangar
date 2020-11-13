import 'jest';
import supertest from 'supertest';
import logger from '../logger';

jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();

// eslint-disable-next-line import/first
import { app, initSlack, initDiscord } from '../app';

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
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
    delete process.env.DISCORD_BOT_TOKEN;
    jest.resetAllMocks();
    mockSlackAuth.mockRejectedValue('Invalid Auth');
  });

  it('responds successfully to GET /', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });

  it('will exit the process when Slack tokens are not provided and NODE_ENV !== "test", because it cannot initialize Slack', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    await initSlack();
    expect(processExitSpy).toBeCalledTimes(1);
  });

  it('will not exit the process when Slack tokens are not provided and the NODE_ENV is "test"', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
    await initSlack();
    expect(processExitSpy).not.toBeCalled();
  });

  it('will initialize correctly when provided with a valid token', async () => {
    mockSlackAuth.mockResolvedValueOnce('Valid Auth');
    await initSlack();
    expect(loggerInfoSpy.mock.calls[loggerInfoSpy.mock.calls.length - 1][0]).toEqual('Slack app initialized successfully');
  });

  it('will not initialize Discord if missing the bot token', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    await initDiscord();
    expect(loggerInfoSpy.mock.calls[loggerInfoSpy.mock.calls.length - 1][0]).toEqual('Discord skipped (missing DISCORD_BOT_TOKEN)');
  });

  it('will exit the process when Discord tokens are provided but setup fails, and NODE_ENV !== "test", because it cannot initialize Discord', async () => {
    jest.mock('../discord', () => ({
      setupDiscord: (): Promise<Error> => Promise.reject(new Error()),
    }));

    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    Object.defineProperty(process.env, 'DISCORD_BOT_TOKEN', { value: 'SOMETHING' });
    await initDiscord();
    expect(processExitSpy).toBeCalledTimes(1);
  });
});
