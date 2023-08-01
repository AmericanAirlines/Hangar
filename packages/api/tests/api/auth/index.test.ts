import express, { Request, Response } from 'express';
import request from 'supertest';
import { slack } from '../../../src/api/auth/slack';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/api/auth/slack', () => ({
  slack: jest.fn().mockImplementation(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
}));
const mockGet = getMock(slack);

describe('slack auth declarations', () => {
  it('registers the auth handler', async () => {
    await jest.isolateModulesAsync(async () => {
      // Import auth for the first time AFTER the slack method is mocked
      const { auth } = require('../../../src/api/auth');
      const app = express();
      app.use(auth);

      await request(app).get('/slack');

      expect(mockGet).toBeCalledTimes(1);
    });
  });
});
