import { NextFunction, Request, Response } from 'express';
import supertest from 'supertest';

jest.mock('../../src/api/settings', () => ({
  enforceRateLimiting: (req: Request, res: Response, next: NextFunction) => {
    next();
  },
}));

describe('/api route registration', () => {
  it('registers a generic catch-all handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = require('../../src/api');

      const res = await supertest(api).get('/garbageRoute');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: 'API route not found',
        }),
      );
    });
  });
});
