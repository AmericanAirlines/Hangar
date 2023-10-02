import { WebClient } from '@slack/web-api';
import { mockEnv } from '../testUtils/mockEnv';

const mockAuth = {
  bot_id: 'ID',
  user_id: 'user ID',
};

jest.mock('@slack/web-api', () => ({
  __esModule: true,
  WebClient: jest.fn(() => ({
    auth: {
      test: jest.fn(() => mockAuth),
    },
  })),
}));

describe('authorize', () => {
  it('uses the provided bot token to test client auth', async () => {
    await jest.isolateModulesAsync(async () => {
      mockEnv({ nodeEnv: 'development' });
      const { authorize } = await import('../../src/slack/authorize');
      const mockToken = 'auth pls';

      const result = await authorize(mockToken)();

      expect(result).toEqual(expect.objectContaining({}));
      expect(WebClient).toBeCalledWith(mockToken);
    });
  });

  it('returns test data in a test environment', async () => {
    await jest.isolateModulesAsync(async () => {
      const { authorize } = await import('../../src/slack/authorize');

      const result = await authorize('junk')();

      expect(result).toEqual(
        expect.objectContaining({
          botToken: 'junk test token',
        }),
      );

      expect(WebClient).not.toBeCalled();
    });
  });

  it('uses a cached version of the authorizeResult if one exists', async () => {
    await jest.isolateModulesAsync(async () => {
      mockEnv({ nodeEnv: 'development' });
      const { authorize } = await import('../../src/slack/authorize');
      const mockToken = 'auth pls';

      const authorizeMethod = authorize(mockToken);
      const result1 = await authorizeMethod();
      const result2 = await authorizeMethod();

      expect(WebClient).toBeCalledTimes(1);
      expect(result1).toBe(result2);
    });
  });
});
