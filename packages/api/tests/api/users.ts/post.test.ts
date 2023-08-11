import { User } from '@hangar/database';
import { Response } from 'express';
import { post } from '../../../src/api/users/post';

jest.mock('@hangar/database', () => ({
  User: jest.fn(),
}));

const mockUserId = '1';
const mockEntityManager = {
  persistAndFlush: jest.fn(async (user: User) => {
    // eslint-disable-next-line no-param-reassign
    user.id = mockUserId;
  }),
};
const mockRes: jest.Mocked<Partial<Response>> = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
};

describe('users post endpoint', () => {
  it('creates a new user', async () => {
    const mockUser = { value: "I'm a user!" };
    (User.prototype.constructor as jest.Mock).mockImplementationOnce(() => mockUser);

    const mockReq = {
      entityManager: mockEntityManager,
      session: {
        email: 'John.Doe@email.com',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
      },
    } as any;
    const expectedUserConstructorData = { ...mockReq.body, ...mockReq.session };

    await post(mockReq as any, mockRes as Response);

    expect(User as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining(expectedUserConstructorData),
    );
    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.send).toBeCalledWith(mockUser);
    expect(mockReq.session.id).toBe(mockUserId);
  });

  it('returns an error when a user with the same email already exists', async () => {
    const mockReq = {
      entityManager: mockEntityManager,
      session: {},
      body: {},
    };

    mockEntityManager.persistAndFlush.mockRejectedValueOnce({ code: '23505' });

    await post(mockReq as any, mockRes as Response);

    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.send).toHaveBeenCalledWith('User already exists');
  });

  it('returns an error when something unexpected goes wrong', async () => {
    const mockReq = {
      entityManager: mockEntityManager,
      session: {},
      body: {},
    };

    mockEntityManager.persistAndFlush.mockRejectedValueOnce(new Error('Whoops!'));

    await post(mockReq as any, mockRes as Response);

    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
  });
});
