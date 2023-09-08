import { ExpoJudgingSession } from '@hangar/database';
import { validatePayload } from '../../../src/utils/validatePayload';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { post } from '../../../src/api/expoJudgingSession/post';

jest.mock('@hangar/database', () => ({
  ExpoJudgingSession: jest.fn(),
}));

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('expoJudgingSession post endpoint', () => {
  it('should create an ExpoJudgingSession, add a createdBy, and return a 200', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false } as any);
    const mockUser = { id: '1', toReference: jest.fn() };
    const req = createMockRequest({ user: mockUser as any });
    const { entityManager } = req;
    const res = createMockResponse();
    const mockExpoJudgingSession = {
      createdBy: mockUser,
      inviteCode: '00000000-0000-0000-0000-00000000000',
    };

    (ExpoJudgingSession.prototype.constructor as jest.Mock).mockReturnValueOnce(
      mockExpoJudgingSession,
    );

    await post(req as any, res as any);

    expect(ExpoJudgingSession.prototype.constructor as jest.Mock).toHaveBeenCalledTimes(1);
    expect(entityManager.persistAndFlush).toBeCalledWith(mockExpoJudgingSession);
    expect(res.send).toHaveBeenCalledWith(mockExpoJudgingSession);
  });

  it('should return 500 something else goes wrong', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false } as any);
    const mockUser = { id: '1' };
    const req = createMockRequest({ user: mockUser as any });
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));

    await post(req as any, res as any);

    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persistAndFlush).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  it('bails if a validation error occurs', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));

    await post(req as any, res as any);

    expect(ExpoJudgingSession.prototype.constructor as jest.Mock).not.toBeCalled();
  });
});
