import { Response } from 'express';
import { put } from '../../../src/api/user/put';
import { validatePayload } from '../../../src/utils/validatePayload';
import { getMock } from '../../testUtils/getMock';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockEntityManager } from '../../testUtils/createMockEntityManager';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('users post endpoint', () => {
  it('creates a new user with the validated data', async () => {
    const mockUser = { assign: jest.fn() };

    const mockEntityManager = createMockEntityManager();
    const mockReq = createMockRequest({
      entityManager: mockEntityManager,
      user: mockUser as any,
      body: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });
    const mockRes = createMockResponse();

    const validatedUser = { ...mockReq.body };
    validatePayloadMock.mockReturnValueOnce({ data: mockReq.body });

    await put(mockReq as any, mockRes as any);

    expect(mockUser.assign).toHaveBeenCalledWith(validatedUser);
    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.send).toBeCalledWith(mockUser);
  });

  it('returns immediately if validation fails', async () => {
    const mockUser = { assign: jest.fn() } as any;
    const mockReq = createMockRequest({ user: mockUser });
    const mockRes = createMockResponse();

    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });

    await put(mockReq as any, mockRes as Response);

    expect(mockUser.assign).not.toBeCalled();
  });

  it('returns an error when something unexpected goes wrong', async () => {
    const mockEntityManager = createMockEntityManager({
      persistAndFlush: jest.fn().mockRejectedValueOnce(new Error('Whoops!')),
    });
    const mockReq = createMockRequest({
      entityManager: mockEntityManager,
      user: { assign: jest.fn() } as any,
    });
    const mockRes = createMockResponse();

    validatePayloadMock.mockReturnValueOnce({ data: mockReq.body });

    await put(mockReq as any, mockRes as Response);

    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
  });
});
