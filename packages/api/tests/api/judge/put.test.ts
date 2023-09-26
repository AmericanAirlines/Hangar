import { Judge } from '@hangar/database';
import { put } from '../../../src/api/judge/put';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { validatePayload } from '../../../src/utils/validatePayload';

jest.mock('@hangar/database', () => ({
  Judge: jest.fn(),
}));

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('judge put endpoint', () => {
  it('bails if a validation error occurs', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });

    const req = createMockRequest({ query: { inviteCode: 'xyz' } });
    const res = createMockResponse();

    await put(req as any, res as any);

    expect(validatePayloadMock).toBeCalledTimes(1);
    expect(req.entityManager.findOne).not.toHaveBeenCalled();
  });

  it('should return a 409 if the user is already a judge', async () => {
    validatePayloadMock.mockReturnValueOnce({
      errorHandled: false,
      data: { inviteCode: 'xyz' },
    } as any);
    const req = createMockRequest({ query: { inviteCode: 'xyz' } });
    const res = createMockResponse();
    req.entityManager.findOne.mockRejectedValueOnce({ code: '23505' });

    await put(req as any, res as any);
    expect(req.entityManager.findOne).toBeCalledTimes(1);
    expect(req.entityManager.persistAndFlush).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenLastCalledWith(409);
  });

  it('should register judge to a new judgingSession', async () => {
    validatePayloadMock.mockReturnValueOnce({
      errorHandled: false,
      data: { inviteCode: 'xyz' },
    } as any);
    const mockJudge = { expoJudgingSessions: { add: jest.fn() } };

    const req = createMockRequest({
      query: { inviteCode: 'xyz' },
      judge: mockJudge as any,
    });

    const mockExpoJudgingSession = { garbage: true };
    req.entityManager.findOne.mockReturnValueOnce(mockExpoJudgingSession as any);

    const res = createMockResponse();

    await put(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledTimes(1);

    expect(req.entityManager.persistAndFlush).toBeCalledTimes(1);
    expect(res.send).toHaveBeenLastCalledWith(mockJudge);
  });

  it('should return 500 when it fails to create a judge', async () => {
    const mockUserReference = { id: '1' };

    validatePayloadMock.mockReturnValueOnce({
      errorHandled: false,
      data: { inviteCode: 'xyz' },
    } as any);
    const req = createMockRequest({
      user: { toReference: jest.fn().mockReturnValueOnce(mockUserReference) } as any,
      query: { inviteCode: 'xyz' },
    });
    const res = createMockResponse();
    req.entityManager.findOne.mockRejectedValueOnce('uh oh error occurred');

    await put(req as any, res as any);

    expect(Judge.prototype.constructor as jest.Mock).not.toHaveBeenCalled();

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
