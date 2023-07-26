import express from 'express';
import { getMock } from '../../testUtils/getMock';
import { initSlack } from '../../../src/slack';
import { events } from '../../../src/api/slack/events';

jest.mock('../../../src/api/slack/events');
jest.mock('../../../src/slack');
const mockEvents = getMock(events);
const mockInitSlack = getMock(initSlack);

describe('slack route declarations', () => {
  it('registers the app and event handlers', async () => {
    const slackApp = jest.fn();
    const mockBolt = {};
    mockInitSlack.mockReturnValueOnce({ app: slackApp, bolt: mockBolt } as any);

    await jest.isolateModulesAsync(async () => {
      const { slack } = require('../../../src/api/slack');
      const app = express();
      app.use(slack);

      expect(mockEvents).toBeCalledWith(mockBolt);
    });
  });
});
