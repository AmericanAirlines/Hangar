import { Criteria, CriteriaJudgingSession, CriteriaJudgingSubmission } from '@hangar/database';
import { get } from '../../../../../src/api/criteriaJudgingSession/id/results/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';

const mockCjsId = '123';
const req = createMockRequest({ params: { id: mockCjsId } });
const res = createMockResponse();
const mockCriteria1: Partial<Criteria> = {
  id: '1',
  scaleMin: 0,
  scaleMax: 4,
  weight: 0.7,
};
const mockCriteria2: Partial<Criteria> = {
  id: '2',
  scaleMin: 1,
  scaleMax: 5,
  weight: 0.3,
};
const mockProject = {
  id: '456',
  serialize: jest.fn().mockReturnThis(),
};
const mockCriteriaJudgingSession = {
  projects: {
    getItems: jest.fn().mockReturnValue([mockProject]),
  },
};
const mockCriteriaJudgingSubmissions = [
  {
    project: { id: mockProject.id },
    scores: [
      {
        score: 2,
        criteria: { id: mockCriteria1.id, $: mockCriteria1 },
      },
      {
        score: 5,
        criteria: { id: mockCriteria2.id, $: mockCriteria2 },
      },
    ],
  },
  {
    project: { id: mockProject.id },
    scores: [
      {
        score: 5,
        criteria: { id: mockCriteria2.id, $: mockCriteria2 },
      },
    ],
  },
];

describe('results get handler', () => {
  it('generates a score object for a submission', async () => {
    req.entityManager.find.mockResolvedValueOnce(mockCriteriaJudgingSubmissions);
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockCriteriaJudgingSession);

    await get(req as any, res as any);

    expect(req.entityManager.find).toBeCalledWith(
      CriteriaJudgingSubmission,
      expect.objectContaining({ criteriaJudgingSession: mockCjsId }),
      expect.objectContaining({ populate: ['scores.criteria'] }),
    );
    expect(req.entityManager.findOneOrFail).toBeCalledWith(
      CriteriaJudgingSession,
      expect.objectContaining({ id: mockCjsId }),
      expect.objectContaining({ populate: ['projects'] }),
    );

    expect(res.send).toBeCalledWith(
      expect.arrayContaining([
        {
          ...mockProject,
          results: { score: 0.65 },
        },
      ]),
    );
  });

  it('returns a 500 if something goes wrong', async () => {
    req.entityManager.find.mockRejectedValue(new Error('Whoops'));

    await get(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
