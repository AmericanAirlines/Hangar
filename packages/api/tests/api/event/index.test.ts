import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../../testUtils/getMock';
import { get } from '../../../src/api/event/get';

jest.mock('../../../src/api/event', () => ({
  get: createMockHandler(),
}));

const mockGet = getMock(get);

describe('api/event route', () => {
  it(' registers the get endpoint', async () => {
    await jest.isolateModules(async () => {
      const { event } = await import('../../../src/api/event');

      const app = express();
      app.use(event);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
      expect(mockGet).toBeCalled();
    });
  });
});
