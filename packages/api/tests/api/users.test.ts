import { users } from '../../src/api/users';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const sampleUser: Partial<User> = {
  name: 'Bill Nye',
  authId: '112',
  subscribed: false,
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/users', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('non-numeric input returns 400 error', async () => {
    const handler = testHandler(users);

    const { text } = await handler.get('/abc').expect(400);
    expect(text).toEqual('The user id must be a number');
  });

  it('successfully returns a user', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);

    const { body } = await handler.get('/0').expect(200);

    expect(body).toEqual(sampleUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { id: '0' });
  });

  it('non-existant user returns 404', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/1').expect(404);
  });

  it('returns 500 error', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.get('/0').expect(500);
    expect(text).toEqual('There was an issue getting user');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
