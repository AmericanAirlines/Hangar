import 'jest';
import supertest from 'supertest';

/* eslint-disable @typescript-eslint/no-var-requires */

describe('GET /', () => {
  beforeAll(() => {
    process.env.SLACK_SIGNING_SECRET = 'A JUNK TOKEN';
    process.env.SLACK_BOT_TOKEN = 'ANOTHER JUNK TOKEN';
  });

  it('responds successfully', (done) => {
    const app = require('./app').default;
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});
