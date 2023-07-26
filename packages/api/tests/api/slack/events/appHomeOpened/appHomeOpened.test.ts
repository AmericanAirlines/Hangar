import type { WebClient } from '@slack/web-api';
import { appHomeOpened } from '../../../../../src/api/slack/events/appHomeOpened';
import { logger } from '../../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('app_home_opened handler', () => {
  it('publishes a view with relevant info', async () => {
    const mockEvent = {
      user: 'fake user',
    };
    const mockClient: jest.Mocked<
      Partial<Omit<WebClient, 'views'>> & { views: jest.Mocked<Partial<WebClient['views']>> }
    > = {
      views: {
        publish: jest.fn(),
      },
    };

    await appHomeOpened({ event: mockEvent, client: mockClient } as any);

    expect(mockClient.views.publish).toBeCalledWith(
      expect.objectContaining({
        user_id: mockEvent.user,
        view: expect.objectContaining({
          type: 'home',
          blocks: expect.arrayContaining([
            expect.objectContaining({
              text: expect.objectContaining({
                text: expect.stringContaining(`<@${mockEvent.user}>`),
              }),
            }),
          ]),
        }),
      }),
    );
    expect(loggerErrorSpy).not.toBeCalled();
  });

  it('logs an error on failure', async () => {
    await appHomeOpened({} as any);
    expect(loggerErrorSpy).toBeCalledTimes(1);
  });
});
