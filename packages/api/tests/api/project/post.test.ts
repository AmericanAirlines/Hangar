import { Project } from '@hangar/database';
import axios from 'axios';
import { post } from '../../../src/api/project/post';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { validatePayload } from '../../../src/utils/validatePayload';

jest.mock('@hangar/database', () => ({
  Project: jest.fn(),
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('project post endpoint', () => {
  it('should create a project, add a contributor, and return project with inviteCode and a 200 status', async () => {
    const mockProjectData = { name: 'A cool project' };

    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data: mockProjectData } as any);

    const mockUser = { id: '1' };
    const req = createMockRequest({ user: mockUser as any });
    const res = createMockResponse();

    const { entityManager } = req;
    entityManager.findOneOrFail.mockResolvedValueOnce(mockUser);

    const entityData = {
      // Data returned from the creation of the entity
      ...mockProjectData,
      id: '123',
      inviteCode: 'a code',
    };
    const mockProject = {
      ...entityData,
      contributors: { add: jest.fn() },
      toPOJO: jest.fn(),
    };
    (Project.prototype.constructor as jest.Mock).mockReturnValueOnce(mockProject);

    const { inviteCode, ...entityDataWithoutInviteCode } = { ...entityData };
    mockProject.toPOJO.mockReturnValueOnce(entityDataWithoutInviteCode);

    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await post(req as any, res as any);

    expect(Project.prototype.constructor as jest.Mock).toHaveBeenCalledWith(mockProjectData);
    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).toBeCalledTimes(1);
    expect(mockProject.contributors.add).toBeCalledWith(mockUser);
    expect(entityManager.persist).toBeCalledWith(mockProject);
    expect(mockProject.toPOJO).toBeCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      inviteCode,
      ...entityDataWithoutInviteCode,
    });
  });

  it('should return 409 if the project already exists', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce({ name: 'NotFoundError' });
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await post(req as any, res as any);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(409);
  });

  it('should return 423 if the row lock could not be obtained', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce({ code: '55P03' });
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await post(req as any, res as any);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(423);
  });

  it('should return 500 something else goes wrong', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await post(req as any, res as any);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  it('bails if a validation error occurs', async () => {
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });
    const req = createMockRequest();
    const res = createMockResponse();

    await post(req as any, res as any);

    expect(validatePayloadMock).toBeCalledTimes(1);
    expect(axios.get as jest.Mock).not.toBeCalled();
  });

  it('should return 400 when repoUrl return non 200 status code', async () => {
    const data = { repoUrl: 'https://google.com/' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 404 });

    await post(req as any, res as any);

    expect(axios.get as jest.Mock).toBeCalled();
    expect(res.status).toBeCalledWith(400);

    expect(req.entityManager.transactional).not.toBeCalled();
  });

  it('should return 400 when repoUrl fetch fails', async () => {
    const data = { repoUrl: 'https://google.com/' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error(''));

    await post(req as any, res as any);

    expect(axios.get as jest.Mock).toBeCalled();
    expect(res.status).toBeCalledWith(400);

    expect(req.entityManager.transactional).not.toBeCalled();
  });

  it('should throw an error of project not created', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockResolvedValueOnce(undefined);
    (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await post(req as any, res as any);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
