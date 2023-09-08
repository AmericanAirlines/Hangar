import express from 'express';
import supertest from 'supertest';
import { createMockNext } from '../testUtils/expressHelpers/createMockNext';
import { createMockHandler } from '../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../testUtils/getMock';
import { admin } from '../../src/api/admin';
import { auth } from '../../src/api/auth';
import { event } from '../../src/api/event';
import { health } from '../../src/api/health';
import { prize } from '../../src/api/prize';
import { project } from '../../src/api/project';
import { user } from '../../src/api/user';

jest.mock('../../src/api/settings', () => ({
  enforceRateLimiting: createMockNext(),
}));

jest.mock('../../src/api/admin', () => ({ admin: createMockHandler() }));
const mockAdmin = getMock(admin);

jest.mock('../../src/api/auth', () => ({ auth: createMockHandler() }));
const mockAuth = getMock(auth);

jest.mock('../../src/api/event', () => ({ event: createMockHandler() }));
const mockEvent = getMock(event);

jest.mock('../../src/api/health', () => ({ health: createMockHandler() }));
const mockHealth = getMock(health);

jest.mock('../../src/api/prize', () => ({ prize: createMockHandler() }));
const mockPrize = getMock(prize);

jest.mock('../../src/api/project', () => ({ project: createMockHandler() }));
const mockProject = getMock(project);

jest.mock('../../src/api/user', () => ({ user: createMockHandler() }));
const mockUser = getMock(user);

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

  it('registers unauthed handlers', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = await import('../../src/api');
      const app = express();
      app.use(api);

      await supertest(app).get('/auth');
      expect(mockAuth).toBeCalledTimes(1);

      await supertest(app).get('/event');
      expect(mockEvent).toBeCalledTimes(1);

      await supertest(app).get('/health');
      expect(mockHealth).toBeCalledTimes(1);

      await supertest(app).get('/prize');
      expect(mockPrize).toBeCalledTimes(1);
    });
  });

  it('registers self-protected handlers', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = await import('../../src/api');
      const app = express();
      app.use(api);

      await supertest(app).get('/admin');
      expect(mockAdmin).toBeCalledTimes(1);

      await supertest(app).get('/project');
      expect(mockProject).toBeCalledTimes(1);

      await supertest(app).get('/user');
      expect(mockUser).toBeCalledTimes(1);
    });
  });
});
