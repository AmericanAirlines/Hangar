import 'jest';
import supertest from 'supertest';
import app from './app';

describe('GET /', () => {
  beforeAll(() => {
    process.env.SLACK_SIGNING_SECRET = 'A JUNK TOKEN';
    process.env.SLACK_BOT_TOKEN = 'ANOTHER JUNK TOKEN';
  });

  it('responds successfully', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});
