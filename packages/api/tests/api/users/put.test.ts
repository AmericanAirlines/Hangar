import { User } from '@hangar/database';
import { Response } from 'express';
import { put } from '../../../src/api/users/put';

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
    const mockUser = { assign: jest.fn() };

    const mockReq = {
      entityManager: mockEntityManager,
      user: mockUser,
      body: {
        firstName: 'John',
        lastName: 'Doe',
      },
    } as any;

    await put(mockReq as any, mockRes as Response);

    expect(mockUser.assign).toHaveBeenCalledWith(expect.objectContaining(mockReq.body));
    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.send).toBeCalledWith(mockUser);
  });

  it('returns an error when something unexpected goes wrong', async () => {
    const mockReq = {
      entityManager: mockEntityManager,
      user: { assign: jest.fn() },
      body: {},
    };

    mockEntityManager.persistAndFlush.mockRejectedValueOnce(new Error('Whoops!'));

    await put(mockReq as any, mockRes as Response);

    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
  });
});
