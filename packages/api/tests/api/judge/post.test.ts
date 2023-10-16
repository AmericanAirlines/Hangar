/* eslint-disable max-lines */
import { ExpoJudgingSessionContext, Judge } from '@hangar/database';
import { post } from '../../../src/api/judge/post';
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

describe('judge post endpoint', () => {
  it('bails if a validation error occurs', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });

    const req = createMockRequest({ query: { inviteCode: 'xyz' } });
    const res = createMockResponse();

    await post(req as any, res as any);

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

    await post(req as any, res as any);

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

    await post(req as any, res as any);
    expect(req.entityManager.findOne).toBeCalledTimes(1);
    expect(req.entityManager.persistAndFlush).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenLastCalledWith(409);
  });

  it('should register user as judge', async () => {
    const mockUserReference = { id: '1' };

    validatePayloadMock.mockReturnValueOnce({
      errorHandled: false,
      data: { inviteCode: 'xyz' },
    } as any);
    const req = createMockRequest({
      user: { toReference: jest.fn().mockReturnValueOnce(mockUserReference) } as any,
      query: { inviteCode: 'xyz' },
    });

    const mockExpoJudgingSession = { toReference: jest.fn() };
    req.entityManager.findOne.mockReturnValueOnce(mockExpoJudgingSession as any);

    const res = createMockResponse();
    const mockJudge = { toReference: jest.fn(), expoJudgingSessionContexts: { add: jest.fn() } };
    (Judge.prototype.constructor as jest.Mock).mockReturnValueOnce(mockJudge);
    const mockEjsContext = {};
    (ExpoJudgingSessionContext.prototype.constructor as jest.Mock).mockReturnValueOnce(
      mockEjsContext,
    );

    await post(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledTimes(1);
    expect(Judge.prototype.constructor as jest.Mock).toHaveBeenCalledWith({
      user: mockUserReference,
    });

    expect(mockJudge.expoJudgingSessionContexts.add).toBeCalledWith(mockEjsContext);

    expect(req.entityManager.persistAndFlush).toBeCalled();
    expect(res.redirect).toHaveBeenLastCalledWith('/judgingIntro');
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

    await post(req as any, res as any);

    expect(Judge.prototype.constructor as jest.Mock).not.toHaveBeenCalled();

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
