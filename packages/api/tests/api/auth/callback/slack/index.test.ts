import express, { Request, Response } from 'express';
import request from 'supertest';
import { get } from '../../../../../src/api/auth/callback/slack/get';
import { getMock } from '../../../../testUtils/getMock';

jest.mock('../../../../../src/api/auth/callback/slack/get', () => ({
  get: jest.fn().mockImplementation(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
}));
const mockGet = getMock(get);

describe('slack callback declarations', () => {
  it('registers the callback handler', async () => {
    await jest.isolateModulesAsync(async () => {
      // Import callback for the first time AFTER the slack method is mocked
      const { slack } = require('../../../../../src/api/auth/callback/slack');

      const app = express();
      app.use(slack);

      await request(app).get('/');

      expect(mockGet).toBeCalledTimes(1);
    });
  });
});
