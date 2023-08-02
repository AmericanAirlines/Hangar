import express, { Request, Response } from 'express';
import request from 'supertest';
import { slack } from '../../../../src/api/auth/callback/slack';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/api/auth/callback/slack', () => ({
  slack: jest.fn().mockImplementation(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
}));
const mockGet = getMock(slack);

describe('slack callback declarations', () => {
  it('registers the callback handler', async () => {
    await jest.isolateModulesAsync(async () => {
      // Import callback for the first time AFTER the slack method is mocked
      const { callback } = require('../../../../src/api/auth/callback');
      const app = express();
      app.use(callback);

      await request(app).get('/slack');

      expect(mockGet).toBeCalledTimes(1);
    });
  });
});
