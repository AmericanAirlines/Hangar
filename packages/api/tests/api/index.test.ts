import express from 'express';
import supertest from 'supertest';
import { createMockNext } from '../testUtils/expressHelpers/createMockNext';
import { createMockHandler } from '../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../testUtils/getMock';
import { admin } from '../../src/api/admin';
import { health } from '../../src/api/health';

jest.mock('../../src/api/settings', () => ({
  enforceRateLimiting: createMockNext(),
}));

jest.mock('../../src/api/admin', () => ({ admin: createMockHandler() }));
const mockAdmin = getMock(admin);

jest.mock('../../src/api/health', () => ({ health: createMockHandler() }));
const mockHealth = getMock(health);

describe('/api route registration', () => {
  it('registers a generic catch-all handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = await import('../../src/api');
      const app = express();
      app.use(api);

      const res = await supertest(app).get('/garbageRoute');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: 'API route not found',
        }),
      );
    });
  });

  it('registers handlers', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = await import('../../src/api');
      const app = express();
      app.use(api);

      await supertest(app).get('/admin');
      expect(mockAdmin).toBeCalledTimes(1);

      await supertest(app).get('/health');
      expect(mockHealth).toBeCalledTimes(1);
    });
  });
});
