import { post } from '../../../src/api/criteriaJudgingSubmission/post';
import { validatePayload } from '../../../src/utils/validatePayload';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/utils/validatePayload');

const mockValidatePayload = getMock(validatePayload);

describe('criteriaJudgingSubmission GET handler', () => {
  it('creates a criteriaJudgingSubmission', () => {});

  it('bails when validation fails', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    mockValidatePayload.mockReturnValueOnce({ errorHandled: true });

    await post(req as any, res as any);

    expect(res.sendStatus).not.toBeCalled();
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
