import { User } from '@hangar/database';
import { authenticateUser, OAuthUserData } from '../../src/utils/authenticateUser';
import { logger } from '../../src/utils/logger';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

jest.mock('@hangar/database', () => ({
  User: jest.fn(),
}));

describe('authenticate user', () => {
  it('finds an existing user, updates the session, and redirects to the root', async () => {
    const mockUser = { id: '1' };
    const mockSession = {} as any;
    const req = createMockRequest({
      user: mockUser as any,
      session: mockSession,
    });
    req.entityManager.findOne.mockResolvedValueOnce(mockUser);
    const res = createMockResponse();

    const data: OAuthUserData = {
      email: 'x',
      firstName: 'a',
      lastName: 'b',
    };

    await authenticateUser({ data, req, res } as any);

    expect(loggerErrorSpy).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(mockSession.id).toEqual(mockUser.id);
  });

  it('creates a user, updates the session, and redirects to the root', async () => {
    const mockUser = { id: '1' };
    const mockSession = {} as any;
    (User.prototype.constructor as jest.Mock).mockImplementationOnce(() => mockUser);
    const req = createMockRequest({ session: mockSession });
    const res = createMockResponse();
    const data: OAuthUserData = {
      email: 'x',
      firstName: 'a',
      lastName: 'b',
    };

    await authenticateUser({ data, req, res } as any);

    expect(User as jest.Mock).toHaveBeenCalledWith(expect.objectContaining(data));
    expect(req.entityManager.persistAndFlush).toBeCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(mockSession.id).toEqual(mockUser.id);
  });

  it('redirects to an error page if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const data: OAuthUserData = {
      email: 'x',
      firstName: 'a',
      lastName: 'b',
    };

    await authenticateUser({ data, req, res } as any);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('/error'));
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
