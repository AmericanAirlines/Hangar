import { get } from '../../../../../src/api/criteriaJudgingSession/id/results/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';

const req = createMockRequest();
const res = createMockResponse();

describe('results get handler', () => {
  it('', async () => {
    await get(req as any, res as any);

    expect(res.send).toBeCalledWith({});
  });

  it('returns a 500 if something goes wrong', async () => {
    req.entityManager.find.mockRejectedValue(new Error('Whoops'));

    await get(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
