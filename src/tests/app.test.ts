import 'jest';
import supertest from 'supertest';

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

describe('app', () => {
  beforeEach(() => {
    process.env.SLACK_SIGNING_SECRET = 'A JUNK TOKEN';
    process.env.SLACK_BOT_TOKEN = 'ANOTHER JUNK TOKEN';
  });

  it('responds successfully to GET /', (done) => {
    const app = require('../app').default;
    supertest(app)
      .get('/')
      .expect(200, done);
  });

  it('fails to start when Slack tokens are not provided and env isn\'t test', () => {
    delete process.env.SLACK_BOT_TOKEN;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    expect(require('../app').default).toThrow();
    // Reset the env variable to 'test'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
  });

  it('will start correctly in the test environement without a Slack token', () => {
    delete process.env.SLACK_BOT_TOKEN;
    const app = require('../app').default;
    expect(app).toBeDefined();
  });
});
