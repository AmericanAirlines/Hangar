/* eslint-disable max-lines */
import { ExpoJudgingSessionContext, Judge } from '@hangar/database';
import { put } from '../../../src/api/judge/put';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { validatePayload } from '../../../src/utils/validatePayload';

jest.mock('@hangar/database', () => ({
  Judge: jest.fn(),
  ExpoJudgingSessionContext: jest.fn(),
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

  it('should return 403 for an invalid inviteCode', async () => {
    validatePayloadMock.mockReturnValueOnce({
      errorHandled: false,
      data: { inviteCode: 'xyz' },
    } as any);

    const req = createMockRequest({ query: { inviteCode: 'xyz' } });
    const res = createMockResponse();
    req.entityManager.findOne.mockResolvedValueOnce(null);

    await put(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledTimes(1);
    expect(res.sendStatus).toHaveBeenLastCalledWith(403);
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
    const mockJudge = { toReference: jest.fn(), expoJudgingSessionContexts: { add: jest.fn() } };

    const req = createMockRequest({
      query: { inviteCode: 'xyz' },
      judge: mockJudge as any,
    });

    const mockExpoJudgingSession = { toReference: jest.fn() };
    req.entityManager.findOne.mockReturnValueOnce(mockExpoJudgingSession as any);

    const res = createMockResponse();
    const mockExpoJudgingSessionContext = {};
    (ExpoJudgingSessionContext.prototype.constructor as jest.Mock).mockReturnValueOnce(
      mockExpoJudgingSessionContext,
    );

    await put(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledTimes(1);
    expect(mockJudge.expoJudgingSessionContexts.add).toBeCalledWith(mockExpoJudgingSessionContext);
    expect(req.entityManager.persistAndFlush).toBeCalledTimes(1);
    expect(res.send).toHaveBeenLastCalledWith(mockJudge);
  });

  it('should return 500 when it fails to update a judge', async () => {
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