import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { get } from '../../../src/api/health/get';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/api/health/get', () => ({
  get: jest.fn().mockImplementation(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
}));
const mockGet = getMock(get);

describe('health route declarations', () => {
  it('registers the GET handler', async () => {
    await jest.isolateModulesAsync(async () => {
      // Import health for the first time AFTER the get method is mocked
      const { health } = require('../../../src/api/health');
      const app = express();
      app.use(health);

      await supertest(app).get('');

      expect(mockGet).toBeCalledTimes(1);
    });
  });
});
