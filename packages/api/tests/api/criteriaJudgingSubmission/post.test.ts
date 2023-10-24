/* eslint-disable max-lines */
import { DriverException } from '@mikro-orm/core';
import { z } from 'zod';
import { Schema } from '@hangar/shared';
import { CriteriaJudgingSubmission, CriteriaScore } from '@hangar/database';
import { post } from '../../../src/api/criteriaJudgingSubmission/post';
import { validatePayload } from '../../../src/utils/validatePayload';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/utils/validatePayload');
jest.mock('@hangar/database');

const mockValidatePayload = getMock(validatePayload);

const validPayload: z.infer<typeof Schema.criteriaJudgingSubmission.post> = {
  criteriaJudgingSession: '1',
  project: '2',
  scores: [
    {
      criteria: '3',
      score: 1,
    },
  ],
};

const mockProjects = [{ id: '2', toReference: jest.fn().mockReturnThis() }];
const mockCriteria = {
  id: validPayload.scores[0]?.criteria,
  scaleMin: 0,
  scaleMax: 2,
  toReference: jest.fn().mockReturnThis(),
};
const mockCriteriaList = [mockCriteria];
const mockCriteriaJudgingSession = {
  toReference: jest.fn().mockReturnThis(),
  projects: { load: jest.fn().mockResolvedValue(mockProjects) },
  criteriaList: { getItems: jest.fn().mockReturnValue(mockCriteriaList) },
};

const mockJudge = {
  toReference: jest.fn().mockReturnThis(),
  criteriaJudgingSessions: {
    load: jest.fn().mockResolvedValue([{ ...mockCriteriaJudgingSession }]),
  },
};

const mockCriteriaJudgingSubmission = {
  toReference: jest.fn().mockReturnThis(),
  scores: { add: jest.fn() },
};

describe('criteriaJudgingSubmission GET handler', () => {
  it('creates a criteriaJudgingSubmission', async () => {
    const req = createMockRequest({ judge: mockJudge as any });
    const res = createMockResponse();

    mockValidatePayload.mockReturnValue({ data: { ...validPayload } });
    (CriteriaJudgingSubmission.prototype.constructor as jest.Mock).mockReturnValueOnce(
      mockCriteriaJudgingSubmission,
    );
    const mockCriteriaScore = {};
    (CriteriaScore.prototype.constructor as jest.Mock).mockReturnValueOnce(mockCriteriaScore);

    await post(req as any, res as any);

    expect(mockJudge.criteriaJudgingSessions.load).toBeCalledWith(
      expect.objectContaining({
        where: { id: validPayload.criteriaJudgingSession },
        populate: ['criteriaList'],
      }),
    );

    expect(mockCriteriaJudgingSession.projects.load).toBeCalledWith(
      expect.objectContaining({
        where: { id: validPayload.project },
      }),
    );

    expect(CriteriaJudgingSubmission.prototype.constructor).toBeCalledWith(
      expect.objectContaining({
        judge: mockJudge,
        project: mockProjects[0],
        criteriaJudgingSession: mockCriteriaJudgingSession,
      }),
    );

    expect(CriteriaScore.prototype.constructor).toBeCalledWith(
      expect.objectContaining({
        submission: mockCriteriaJudgingSubmission,
        criteria: expect.objectContaining({ id: validPayload.scores[0]!.criteria }),
        score: validPayload.scores[0]!.score,
      }),
    );

    expect(mockCriteriaJudgingSubmission.scores.add).toBeCalledWith(mockCriteriaScore);
    expect(req.entityManager.persistAndFlush).toBeCalledWith(mockCriteriaJudgingSubmission);

    expect(res.sendStatus).toBeCalledWith(201);
  });

  it('returns a 400 if a matching criteria cannot be found for the judging session', async () => {
    const req = createMockRequest({ judge: mockJudge as any });
    const res = createMockResponse();

    mockValidatePayload.mockReturnValue({ data: { ...validPayload } });
    mockCriteriaJudgingSession.criteriaList.getItems.mockReturnValueOnce([]);

    await post(req as any, res as any);

    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(expect.stringMatching('Unknown criteria:'));
  });

  it('returns a 404 if the judge does not have access to the session', async () => {
    const req = createMockRequest({ judge: mockJudge as any });
    const res = createMockResponse();

    mockValidatePayload.mockReturnValue({ data: { ...validPayload } });
    mockJudge.criteriaJudgingSessions.load.mockResolvedValueOnce([]);

    await post(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(404);
  });

  it('returns a 400 if the project is unrelated to the session', async () => {
    const req = createMockRequest({ judge: mockJudge as any });
    const res = createMockResponse();

    mockValidatePayload.mockReturnValue({ data: { ...validPayload } });
    mockCriteriaJudgingSession.projects.load.mockReturnValueOnce([]);

    await post(req as any, res as any);

    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith('Project does not belong to judging session');
  });

  it('returns a 400 if a score is outside scale bounds', async () => {
    const req = createMockRequest({ judge: mockJudge as any });
    const res = createMockResponse();

    const invalidPayload = { ...validPayload };
    invalidPayload.scores[0]!.score = -1;
    mockValidatePayload.mockReturnValue({ data: invalidPayload });

    await post(req as any, res as any);

    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(expect.stringMatching('Invalid score'));
  });

  it('bails when validation fails', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    mockValidatePayload.mockReturnValueOnce({ errorHandled: true });

    await post(req as any, res as any);

    expect(res.sendStatus).not.toBeCalled();
  });

  it('returns a 409 if a unique constraint violation occurs', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    mockValidatePayload.mockImplementationOnce(() => {
      const error = new Error();
      (error as DriverException).code = '23505';
      throw error;
    });

    await post(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(409);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    mockValidatePayload.mockImplementationOnce(() => {
      throw new Error('Whoops!');
    });

    await post(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
