import { User } from '@hangar/database';
import { Response } from 'express';
import { post } from '../../../src/api/users/post';

jest.mock('@hangar/database', () => ({
  User: jest.fn(),
}));

const mockEntityManager = { persistAndFlush: jest.fn() };
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
    };

    await post(mockReq as any, mockRes as Response);

    expect(User as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ ...mockReq.body, ...mockReq.session }),
    );
    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.send).toBeCalledWith(mockUser);
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
