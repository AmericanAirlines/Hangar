import 'jest';

/* eslint-disable @typescript-eslint/no-var-requires, global-require, no-console */

// console.warn('WARNING: this test will not pass if port 3000 is in use!');

const testPort = 3212;

describe('Server', () => {
  beforeAll(() => {
    // Hide Bolt API key warnings
    process.env.LOG_LEVEL = 'emerg';
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

    // Because starting the server is asynchronous, we need to wait before seeing if the
    // notice of the current port is logged
    await new Promise((resolve) => {
      setTimeout(() => {
        expect(loggerSpy).toHaveBeenCalledWith(`Listening on port ${testPort}`);
        server.close(() => {
          resolve();
        });
      }, 250);
    });
  });

  it('listens to the specified port if provided in process.env', (done) => {
    const server = require('../index').default;

    const { port } = require('../index');
    expect(port).toBe(String(testPort));

    expect(server.address().port).toBe(testPort);
    server.close(done);
  });

  // it('listens on port 3000 as default port', () => {
  //   // NOTE: This test can only be run if the app is not currently running on 3000
  //   // This likely won't be an issue because this should only run in CI OR when index.ts/app.ts is modified
  //   delete process.env.PORT;

  //   const { port, server } = require('../index');
  //   try {
  //     server.close();
  //   } catch (err) {
  //     // Server couldn't be closed, probably becasue it never started because the address was in use
  //   }
  //   expect(port).toBe(String(3000));
  // });
});
