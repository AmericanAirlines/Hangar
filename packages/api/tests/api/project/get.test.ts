import { Project } from '@hangar/database';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../src/api/project/get';

describe('project GET handler', () => {
  it('returns the list of project from DB', async () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockProjects = ['projects'];
    mockRequest.entityManager.find.mockResolvedValueOnce(mockProjects as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.find).toBeCalledTimes(1);
    expect(mockRequest.entityManager.find).toBeCalledWith(Project, expect.objectContaining({}));
    expect(mockResponse.send).toBeCalledWith(mockProjects);
  });
  it('should return 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    req.entityManager.find.mockRejectedValueOnce(new Error('Oh no there is an error'));

    await get(req as any, res as any);

    expect(req.entityManager.find).toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
