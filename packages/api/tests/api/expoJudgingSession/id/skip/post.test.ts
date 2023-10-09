import { post } from '../../../../../src/api/expoJudgingSession/id/skip/post';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('expoJudgingSession/id/skip POST handler', () => {
  it('calls the skip method on the judge entity', async () => {
    const mockId = '123';
    const mockExpoJudgingSessionContexts = [{ expoJudgingSession: { id: mockId } }];
    const mockSkip = jest.fn();
    const mockJudge = {
      skip: mockSkip,
      expoJudgingSessionContexts: { getItems: jest.fn(() => mockExpoJudgingSessionContexts) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await post(req as any, res as any);

    expect(mockSkip).toHaveBeenCalledWith({
      entityManager: req.entityManager,
      expoJudgingSession: mockEjs,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await post(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('returns a 403 status if judge does not have access', async () => {
    const mockId = '123';
    const mockExpoJudgingSessionContexts = [] as any[];
    const mockJudge = {
      expoJudgingSessionContexts: { getItems: jest.fn(() => mockExpoJudgingSessionContexts) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await post(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOne.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await post(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
