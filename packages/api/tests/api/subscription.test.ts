import { subscription } from '../../src/api/subscription';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { getMock } from '../testUtils/getMock';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
jest.mock('');
const mockUser: Partial<User> = {};

const populateUserMock = getMock(populateUser).mockImplementation((req, res, next) => {
  req.userEntity = mockUser;
  next();
});

describe('/subscriptions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully subscribes a user', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockResolvedValueOnce(mockUser);
    await handler.post('/subscribe').expect(200);

    expect(mockUser.subscribed).toEqual(true);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('successfully unsubscribes a user', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockResolvedValueOnce(mockUser);
    const { body } = await handler.post('/unsubscribe').expect(200);

    expect(body).toEqual(mockUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { authId: 'testAuthId' });
  });

  it('returns 500 error when the db request fails during subscription', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockResolvedValueOnce(mockUser);
    const errorMsg = 'Uh oh, something went wrong while trying to enable your subscription!';

    const { text } = await handler.post('/subscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns 500 error when the db request fails during unsubscribing', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockResolvedValueOnce(mockUser);
    const errorMsg = 'Uh oh, something went wrong while trying to disable your subscription!';

    const { text } = await handler.post('/unsubscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
