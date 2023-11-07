import { ExpoJudgingSession } from '@hangar/database';
import { get } from '../../../../../src/api/expoJudgingSession/id/projects/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('expoJudgingSession/id/projects GET handler', () => {
  it('queries and returns the current and prev projects', async () => {
    const mockId = '123';
    const currentProject = { $: { serialize: jest.fn().mockReturnThis() } };
    const previousProject = { $: { serialize: jest.fn().mockReturnThis() } };
    const mockExpoJudgingSessionContexts = [
      { expoJudgingSession: { id: mockId }, currentProject, previousProject },
    ];
    const mockJudge = {
      expoJudgingSessionContexts: {
        load: jest.fn().mockReturnThis(),
        getItems: jest.fn(() => mockExpoJudgingSessionContexts),
      },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledWith(ExpoJudgingSession, { id: mockId });
    expect(mockJudge.expoJudgingSessionContexts.load).toBeCalledWith(
      expect.objectContaining({
        populate: expect.arrayContaining([
          'currentProject.contributors',
          'previousProject.contributors',
        ]),
      }),
    );
    expect(res.send).toHaveBeenCalledWith({
      currentProject: currentProject.$,
      previousProject: previousProject.$,
    });
  });

  it('queries and returns undefined for projects that are not set', async () => {
    const mockId = '123';
    const currentProject = undefined;
    const previousProject = undefined;
    const mockExpoJudgingSessionContexts = [
      { expoJudgingSession: { id: mockId }, currentProject, previousProject },
    ];
    const mockJudge = {
      expoJudgingSessionContexts: {
        load: jest.fn().mockReturnThis(),
        getItems: jest.fn(() => mockExpoJudgingSessionContexts),
      },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.send).toHaveBeenCalledWith({
      currentProject: undefined,
      previousProject: undefined,
    });
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('returns a 403 status if there is no current and prev project', async () => {
    const mockId = '123';
    const mockExpoJudgingSessionContexts = [] as any[];
    const mockJudge = {
      expoJudgingSessionContexts: {
        load: jest.fn().mockReturnThis(),
        getItems: jest.fn(() => mockExpoJudgingSessionContexts),
      },
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
