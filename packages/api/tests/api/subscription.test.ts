import { subscription } from '../../src/api/subscription';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { populateUser } from '../../src/middleware/populateUser';
import { getMock } from '../testUtils/getMock';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
jest.mock('../../src/middleware/populateUser.ts');
const mockUser = {} as User;

const populateUserMock = getMock(populateUser).mockImplementation((req, res, next) => {
  req.userEntity = mockUser as User;
  next();
});

describe('/subscriptions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully subscribes a user', async () => {
    const handler = testHandler(subscription);
    await handler.post('/subscribe').expect(200);

    expect(mockUser.subscribed).toEqual(true);
  });

  it('successfully unsubscribes a user', async () => {
    const handler = testHandler(subscription);
    const { body } = await handler.post('/unsubscribe').expect(200);

    expect(body).toEqual(mockUser);
  });

  it('returns 500 error when the user entity is undefined during subscribing', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockImplementationOnce((req, res, next) => {
      next();
    });

    const errorMsg = 'Uh oh, something went wrong while trying to update your subscription!';

    const { text } = await handler.post('/subscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns 500 error when the user entity is undefined during unsubscribing', async () => {
    const handler = testHandler(subscription);
    populateUserMock.mockImplementationOnce((req, res, next) => {
      next();
    });
    const errorMsg = 'Uh oh, something went wrong while trying to update your subscription!';

    const { text } = await handler.post('/unsubscribe').expect(500);
    expect(text).toEqual(errorMsg);

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
