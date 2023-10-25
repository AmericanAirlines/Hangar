import { ExpoJudgingSession } from '@hangar/database';
import { get } from '../../../../src/api/expoJudgingSession/id/get';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('expoJudgingSession/id GET handler', () => {
  it('queries and returns the relevant ejs', async () => {
    const mockId = '123';
    const mockExpoJudgingSessionContexts = [{ expoJudgingSession: { id: mockId } }];
    const mockJudge = {
      expoJudgingSessionContexts: { getItems: jest.fn(() => mockExpoJudgingSessionContexts) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(req.entityManager.findOneOrFail).toBeCalledWith(ExpoJudgingSession, { id: mockId });
    expect(res.send).toHaveBeenCalledWith(mockEjs);
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOneOrFail.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
