import 'jest';
import supertest from 'supertest';
import logger from '../logger';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();

// eslint-disable-next-line import/first
import { app, initSlack } from '../app';

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
    jest.resetModules();
    jest.resetAllMocks();
    mockSlackAuth.mockRejectedValue('Invalid Auth');
  });

  it('responds successfully to GET /', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });

  it("fails to initialize Slack when Slack tokens are not provided and env isn't test and exits", async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    jest.resetModules();
    await initSlack();
    expect(processExitSpy).toBeCalledTimes(1);
  });

  it('fails to initialize Slack, logs an error, but continues in test env', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
    jest.resetModules();
    await initSlack();
    expect(loggerErrorSpy).toBeCalledTimes(1);
    expect(processExitSpy).not.toBeCalled();
  });

  it('will initialize correctly when provided with a valid token', async () => {
    mockSlackAuth.mockResolvedValueOnce('Valid Auth');
    await initSlack();
    expect(loggerInfoSpy.mock.calls[loggerInfoSpy.mock.calls.length - 1][0]).toEqual('Slack app initialized successfully');
  });

  // it('will not wait for Next to initialize when not in production', async () => {
  //   Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
  //   jest.resetModules();

  //   const functionThatShouldntBeCalled = jest.fn();
  //   jest.spyOn(app, 'initNext').mockImplementation(async () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         functionThatShouldntBeCalled();
  //         resolve();
  //       }, 5000);
  //     });
  //   });
  //   await app.init();
  //   expect(functionThatShouldntBeCalled).not.toBeCalled();
  // });
});
