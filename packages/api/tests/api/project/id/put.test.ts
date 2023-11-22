import { Project } from '@hangar/database';
import axios from 'axios';
import { put } from '../../../../src/api/project/id/put';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../../testUtils/getMock';
import { validatePayload } from '../../../../src/utils/validatePayload';

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('../../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);
describe('project put endpoint', () => {
  it('should edit a project and return a 200', async () => {
    const data = { name: 'A cool project' };
    const mockProjectId = '123';
    const mockUser = { id: '1', project: { id: mockProjectId } };
    const req = createMockRequest({ user: mockUser as any, params: { id: mockProjectId } });
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const { entityManager } = req;
    const mockProject = { assign: jest.fn(), id: mockProjectId };

    entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);
    const res = createMockResponse();
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await put(req as any, res as any);

    expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: mockProjectId });
    expect(mockProject.assign).toHaveBeenCalledWith(data);
    expect(entityManager.persistAndFlush).toBeCalledWith(mockProject);
    expect(res.send).toHaveBeenCalledWith(mockProject);
  });

  it('should return 403 when the user does not have permission to edit', async () => {
    const data = { name: 'A cool project' };
    const mockProjectId = '123';
    const mockUser = { id: '1', project: { id: mockProjectId } };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest({ user: mockUser as any, params: { id: '222' } });

    const res = createMockResponse();

    await put(req as any, res as any);

    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should return 500 something else goes wrong', async () => {
    const mockProjectId = '123';
    const data = { name: 'A cool project' };
    const mockUser = { id: '1', project: { id: mockProjectId } };
    const req = createMockRequest({ user: mockUser as any, params: { id: mockProjectId } });
    const res = createMockResponse();
    (req.entityManager.findOneOrFail as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await put(req as any, res as any);

    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  it('bails if a validation error occurs', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });
    const req = createMockRequest();
    const res = createMockResponse();

    await put(req as any, res as any);

    expect(validatePayloadMock).toBeCalledTimes(1);
    expect(axios.get as jest.Mock).not.toBeCalled();
  });

  it('should return 400 when repoUrl return non 200 status code', async () => {
    const data = { repoUrl: 'https://google.com/' };
    const mockProjectId = '123';
    const mockUser = { id: '1', project: { id: mockProjectId } };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest({ user: mockUser as any, params: { id: mockProjectId } });

    const res = createMockResponse();
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 404 });

    await put(req as any, res as any);

    expect(axios.get as jest.Mock).toBeCalled();
    expect(res.status).toBeCalledWith(400);
  });

  it('should return 400 when repoUrl fetch fails', async () => {
    const data = { repoUrl: 'https://google.com/' };
    const mockProjectId = '123';
    const mockUser = { id: '1', project: { id: mockProjectId } };
    const req = createMockRequest({ user: mockUser as any, params: { id: mockProjectId } });
    const res = createMockResponse();
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    await put(req as any, res as any);

    expect(axios.get as jest.Mock).toBeCalled();
    expect(res.status).toBeCalledWith(400);
  });
});
