import { Response } from 'express';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { populateUser } from '../../src/middleware/populateUser';
import { testHandler } from '../testUtils/testHandler';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('populateUser middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws a 401 if a user cannot be found', async () => {
    const handler = testHandler(populateUser, (_req, res) => res.sendStatus(200));
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/').expect(401);

    expect(loggerErrorSpy).toBeCalledTimes(1);
  });

  it('adds the user to the req and continues if a user is found', async () => {
    const mockUser = { name: 'Am not hacker, let me in pls!' };
    const mockUserAuthId = 'auth|1234';

    const mockHandler = jest.fn((_req, res: Response) => res.sendStatus(200));

    const handler = testHandler(
      (req, _res, next) => {
        req.user = { profile: { id: mockUserAuthId } } as any;
        next();
      },
      populateUser,
      mockHandler,
    );

    handler.forkedEntityManager.findOne.mockResolvedValueOnce(mockUser);

    await handler.get('/').expect(200);

    expect(handler.forkedEntityManager.findOne).toBeCalledWith(User, { authId: mockUserAuthId });
    expect(loggerErrorSpy).not.toBeCalled();
    const req = mockHandler.mock.calls[0][0];
    expect(req.userEntity).toEqual(mockUser);
  });

  it('throws a 500 when the db throws an error', async () => {
    const handler = testHandler(populateUser, (_req, res: Response) => res.sendStatus(200));
    handler.forkedEntityManager.findOne.mockRejectedValueOnce(new Error('What is database?'));

    const { text } = await handler.get('/').expect(500);

    expect(text).toEqual(expect.stringContaining('Server error occurred'));
    expect(loggerErrorSpy).toBeCalledTimes(1);
  });
});
