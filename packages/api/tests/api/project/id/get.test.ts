import { Project } from '@hangar/database';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../../src/api/project/id/get';

describe('project GET handler', () => {
  it('returns the list of project details from DB', async () => {
    const mockId = '123';
    const mockRequest = createMockRequest({
      params: { id: mockId },
    });
    const mockResponse = createMockResponse();
    const mockProject = { id: mockId };
    mockRequest.entityManager.findOne.mockResolvedValueOnce(mockProject as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.findOne).toHaveBeenCalledWith(
      Project,
      expect.objectContaining({ id: mockId }),
    );
    expect(mockResponse.send).toBeCalledWith(mockProject);
  });

  it('should return 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    req.entityManager.findOne.mockRejectedValueOnce(new Error('Oh no there is an error'));

    await get(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  it('returns a 404 status if the projectId cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });
});
