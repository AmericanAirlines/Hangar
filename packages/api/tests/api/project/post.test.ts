// import { Response } from 'express';
import { Project } from '@hangar/database';
import { post } from '../../../src/api/project/post';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { validatePayload } from '../../../src/utils/validatePayload';

jest.mock('@hangar/database', () => ({
  Project: jest.fn(),
}));

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('project post enpoint', () => {
  it('should create a project, add a contributor, and return a 200', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const mockUser = { id: '1' };
    const req = createMockRequest({ user: mockUser as any });
    const { entityManager } = req;
    entityManager.findOneOrFail.mockResolvedValueOnce(mockUser);
    const res = createMockResponse();
    const mockProject = { contributors: { add: jest.fn() } };
    (Project.prototype.constructor as jest.Mock).mockReturnValueOnce(mockProject);

    await post(req as any, res as any);

    expect(Project.prototype.constructor as jest.Mock).toHaveBeenCalledWith(data);
    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).toBeCalledTimes(1);
    expect(mockProject.contributors.add).toBeCalledWith(mockUser);
    expect(entityManager.persist).toBeCalledWith(mockProject);
    expect(res.send).toHaveBeenCalledWith(mockProject);
  });

  it('should return 409 if the project already exists', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce({ name: 'NotFoundError' });

    await post(req as any, res as any);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.findOneOrFail).not.toBeCalled();
    expect(req.entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(409);
  });

  it('should return 500 something else goes wrong', async () => {
    const data = { name: 'A cool project' };
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data } as any);
    const req = createMockRequest();
    const res = createMockResponse();
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));

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
    (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));

    await post(req as any, res as any);

    expect(req.entityManager.transactional).not.toBeCalled();
  });
});
