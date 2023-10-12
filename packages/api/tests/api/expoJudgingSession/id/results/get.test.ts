import { ExpoJudgingVote } from '@hangar/database';
import { get } from '../../../../../src/api/expoJudgingSession/id/results/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../../src/utils/logger';
import { getMock } from '../../../../testUtils/getMock';

const loggerErrorSpy = jest.spyOn(logger, 'error');

jest.mock('@hangar/database/src/entities/ExpoJudgingVote');
const mockExpoJudgingVote = getMock(ExpoJudgingVote.tabulate);

describe('expoJudgingSession/id/results GET handler', () => {
  it('calls the tabulate method on the ExpoJudgingVote entity', async () => {
    const mockId = '123';
    const results = [] as any;
    const mockExpoJudgingSessionContexts = [{ expoJudgingSession: { id: mockId } }];
    // const mockExpoJudgingVote = {
    //   tabulate: mockTabulate,
    // };
    const mockJudge = {
      expoJudgingSessionContexts: { getItems: jest.fn(() => mockExpoJudgingSessionContexts) },
    };
    const req = createMockRequest({
      params: { id: mockId },
      judge: mockJudge as any,
    });
    const mockEjs = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(mockExpoJudgingVote).toHaveBeenCalledWith({
      entityManager: req.entityManager,
      expoJudgingSession: mockEjs,
    });
    expect(res.send).toHaveBeenCalledWith(results);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

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

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
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
