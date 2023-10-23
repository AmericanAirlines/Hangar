import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../src/api/project/id/get', () => ({
  get: createMockHandler(),
}));

describe('id session router', () => {
  it('registers the get route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/project/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
