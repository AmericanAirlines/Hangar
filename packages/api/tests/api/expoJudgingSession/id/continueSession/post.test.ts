import { post } from '../../../../../src/api/expoJudgingSession/id/continueSession/post';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('expoJudgingSession/id/continueSession post handler', () => {
  it('calls the continue Session method on the judge entity', async () => {
    const mockId = '123';
    const mockExpoJudgingSessionContexts = [{ expoJudgingSession: { id: mockId } }];
    const mockContinueSession = jest.fn();
    const mockJudge = {
      continue: mockContinueSession,
      expoJudgingSessionContexts: { getItems: jest.fn(() => mockExpoJudgingSessionContexts) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await post(req as any, res as any);

    expect(mockContinueSession).toHaveBeenCalledWith({
      entityManager: req.entityManager,
      expoJudgingSession: mockEjs,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOneOrFail.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await post(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
