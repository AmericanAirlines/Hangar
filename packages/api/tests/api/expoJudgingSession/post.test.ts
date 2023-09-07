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
    const mockAdmin = { user: { id: '1' } };
    const req = createMockRequest({ user: mockAdmin.user as any });
    const { entityManager } = req;
    entityManager.findOneOrFail.mockResolvedValueOnce(mockAdmin.user);
    const res = createMockResponse();
    const mockExpoJudgingSession = {
      createdBy: mockAdmin.user.id,
      inviteCode: '00000000-0000-0000-0000-00000000000',
    };
    (ExpoJudgingSession.prototype.constructor as jest.Mock).mockReturnValueOnce(
      mockExpoJudgingSession,
    );

    await post(req as any, res as any);

    expect(ExpoJudgingSession.prototype.constructor as jest.Mock).toHaveBeenCalledTimes(1);
    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).toBeCalledTimes(1);
    expect(entityManager.persist).toBeCalledWith(mockExpoJudgingSession);
    expect(res.send).toHaveBeenCalledWith(mockExpoJudgingSession);
  });
});
