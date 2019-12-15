import 'jest';

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

const testPort = 3212;

describe('Server', () => {
  beforeAll(() => {
    global.console = {
      ...global.console,
      log: jest.fn(), // console.log are ignored in tests
      //   error: jest.fn(),
      //   warn: jest.fn(),
      //   info: jest.fn(),
      //   debug: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.resetModules();

    // Without a test port, the tests will fail if the server is already running
    process.env.PORT = String(testPort);
    process.env.SLACK_SIGNING_SECRET = 'A JUNK TOKEN';
    process.env.SLACK_BOT_TOKEN = 'ANOTHER JUNK TOKEN';
  });

  it('logs which port the server is listening on', async () => {
    const logger = require('../logger').default;
    const loggerSpy = jest.spyOn(logger, 'info');

    const server = require('../index').default;

    // Because starting the server is synchronous, we need to wait before seeing if the
    // notice of the current port is logged
    await new Promise((resolve) => {
      setTimeout(() => {
        try {
          expect(loggerSpy).toHaveBeenCalledWith(`Listening on port ${testPort}`);
          server.close();
        } finally {
          resolve();
        }
      }, 250);
    });
  });

  it('listens to the specified port if provided in process.env', () => {
    const server = require('../index').default;

    const { port } = require('../index');
    expect(port).toBe(String(testPort));

    expect(server.address().port).toBe(testPort);
    server.close();
  });

  it('listens to defaults to port 3000', () => {
    delete process.env.PORT;
    try {
      const server = require('../index').default;
      server.close();
    } catch (err) {
      // The app is likely already running but we don't need the server anyways
    }

    const { port } = require('../index');
    expect(port).toBe(String(3000));
  });
});
