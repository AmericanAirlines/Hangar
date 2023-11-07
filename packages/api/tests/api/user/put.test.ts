import { put } from '../../../src/api/user/put';
import { validatePayload } from '../../../src/utils/validatePayload';
import { getMock } from '../../testUtils/getMock';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('user post endpoint', () => {
  it('creates a new user with the validated data', async () => {
    const mockUser = { assign: jest.fn() };

    const mockReq = createMockRequest({
      user: mockUser as any,
      body: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });
    const { entityManager: mockEntityManager } = mockReq;
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

    await put(mockReq as any, mockRes as any);

    expect(mockUser.assign).not.toBeCalled();
  });

  it('returns an error when something unexpected goes wrong', async () => {
    const mockReq = createMockRequest({
      user: { assign: jest.fn() } as any,
    });
    const { entityManager: mockEntityManager } = mockReq;
    mockEntityManager.persistAndFlush.mockRejectedValueOnce(new Error('Whoops!'));
    const mockRes = createMockResponse();

    validatePayloadMock.mockReturnValueOnce({ data: mockReq.body });

    await put(mockReq as any, mockRes as any);

    expect(mockEntityManager.persistAndFlush).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
  });
});
