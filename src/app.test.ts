import 'jest';
import supertest from 'supertest';
import app from './app';

describe('GET /', () => {
  it('responds successfully', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});
