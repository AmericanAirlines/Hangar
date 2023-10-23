import { CriteriaJudgingSession } from '@hangar/database';
import { get } from '../../../../../src/api/criteriaJudgingSession/id/projects/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';

describe('projects get handler', () => {
  it('fetches the judging session and returns projects', async () => {
    const mockId = '123';
    const req = createMockRequest({ params: { id: mockId } });
    const res = createMockResponse();

    const mockCjs = { projects: [{ id: mockId }] };
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockCjs as any);

    await get(req as any, res as any);

    expect(req.entityManager.findOneOrFail).toBeCalledWith(
      CriteriaJudgingSession,
      expect.objectContaining({ id: mockId }),
      expect.objectContaining({ populate: ['projects'] }),
    );

    expect(res.send).toBeCalledWith(mockCjs.projects);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    req.entityManager.find.mockRejectedValueOnce('Error');

    await get(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
