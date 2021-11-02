import { subscription } from '../../src/api/subscription';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
const mockUser = { name: 'TestName', subscribed: false, authId: 'testAuthId' };
const mockProfile: Express.User = {
  profile: { id: 'testAuthId' },
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

describe('/subscriptions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully subscribes a user', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockResolvedValueOnce(mockUser);

    const { body } = await handler.get('/subscribe').expect(200);

    expect(body).toEqual(mockUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('successfully unsubscribes a user', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockResolvedValueOnce(mockUser);

    const { body } = await handler.get('/unsubscribe').expect(200);

    expect(body).toEqual(mockUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('throws a 404 if user can not be found in db when subscribing', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/subscribe').expect(404);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('throws a 404 if user can not be found in db when unsubscribing', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/unsubscribe').expect(404);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('returns 500 error when the db request fails during subscription', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));
    const errorMsg = 'Uh oh, something went wrong while trying to enable your subscription!';

    const { text } = await handler.get('/subscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns 500 error when the db request fails during unsubscribing', async () => {
    const handler = testHandler(subscription, mockProfile);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));
    const errorMsg = 'Uh oh, something went wrong while trying to disable your subscription!';

    const { text } = await handler.get('/unsubscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
