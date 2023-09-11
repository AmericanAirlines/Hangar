import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../../testUtils/getMock';
import { get } from '../../../src/api/prize/get';

jest.mock('../../../src/api/prize/get', () => ({
  get: createMockHandler(),
}));

const mockGet = getMock(get);

describe('api/prizes route', () => {
  it('registers the get endpoint', async () => {
    await jest.isolateModulesAsync(async () => {
      const { prize } = await import('../../../src/api/prize');

      const app = express();
      app.use(prize);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
      expect(mockGet).toBeCalled();
    });
  });
});
