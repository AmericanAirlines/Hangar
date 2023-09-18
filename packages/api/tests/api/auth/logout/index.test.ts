import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../../../testUtils/getMock';
import { get } from '../../../../src/api/auth/logout/get';

jest.mock('../../../../src/api/auth/logout/get', () => ({
  get: createMockHandler(),
}));
const mockGet = getMock(get);

describe('logout route registrations', () => {
  it('registers the auth handler', async () => {
    await jest.isolateModulesAsync(async () => {
      // Import auth for the first time AFTER the slack method is mocked
      const { logout } = await import('../../../../src/api/auth/logout');
      const app = express();
      app.use(logout);

      await supertest(app).get('/');

      expect(mockGet).toBeCalledTimes(1);
    });
  });
});
