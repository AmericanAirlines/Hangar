import { ExpoJudgingVote, insufficientVoteCountError } from '@hangar/database';
import { get } from '../../../../../src/api/expoJudgingSession/id/results/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('expoJudgingSession/id/results GET handler', () => {
  it('calls the tabulate method on the ExpoJudgingVote entity', async () => {
    const mockId = '123';

    const tabulate = jest.spyOn(ExpoJudgingVote, 'tabulate');
    const mockResults: any[] = [];
    tabulate.mockResolvedValueOnce(mockResults);
    const req = createMockRequest({
      params: { id: mockId },
    });
    const mockEjs = { id: mockId };
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(tabulate).toHaveBeenCalledWith({
      entityManager: req.entityManager,
      expoJudgingSession: mockEjs,
    });
    expect(res.send).toHaveBeenCalledWith(mockResults);
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('return 409 if there are insufficient votes', async () => {
    const mockId = '123';

    const tabulate = jest.spyOn(ExpoJudgingVote, 'tabulate');

    const errorMessage = 'need more votes';
    tabulate.mockRejectedValueOnce(new Error(errorMessage, { cause: insufficientVoteCountError }));
    const req = createMockRequest({
      params: { id: mockId },
    });
    const mockEjs = { id: mockId };
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toBeCalledWith(errorMessage);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOne.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
