// import { Response } from 'express';
import { Project } from '@hangar/database';
import { post } from '../../../src/api/project/post';
import { createMockEntityManager } from '../../testUtils/createMockEntityManager';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

jest.mock('@hangar/database', () => ({
  Project: jest.fn(),
}));

describe('project post enpoint', () => {
  it('should create a project, add a contributor, and return a 200', async () => {
    const mockUser = { id: '1' };
    const entityManager = createMockEntityManager({
      findOneOrFail: jest.fn().mockResolvedValueOnce(mockUser),
    });
    const req = createMockRequest({ entityManager, user: mockUser as any });
    const res = createMockResponse();
    const mockProject = { contributors: { add: jest.fn() } };
    (Project.prototype.constructor as jest.Mock).mockReturnValueOnce(mockProject);

    await post(req as any, res as any);

    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).toBeCalledTimes(1);
    expect(mockProject.contributors.add).toBeCalledWith(mockUser);
    expect(entityManager.persist).toBeCalledWith(mockProject);
    expect(res.send).toHaveBeenCalledWith(mockProject);
  });

  it('should return 409 if the project already exists', async () => {
    const entityManager = createMockEntityManager();
    const req = createMockRequest({ entityManager });
    const res = createMockResponse();
    (entityManager.transactional as jest.Mock).mockRejectedValueOnce({ name: 'NotFoundError' });

    await post(req as any, res as any);

    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).not.toBeCalled();
    expect(entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(409);
  });

  it('should return 423 if the row lock could not be obtained', async () => {
    const entityManager = createMockEntityManager();
    const req = createMockRequest({ entityManager });
    const res = createMockResponse();
    (entityManager.transactional as jest.Mock).mockRejectedValueOnce({ code: '55P03' });

    await post(req as any, res as any);

    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).not.toBeCalled();
    expect(entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(423);
  });

  it('should return 500 something else goes wrong', async () => {
    const entityManager = createMockEntityManager();
    const req = createMockRequest({ entityManager });
    const res = createMockResponse();
    (entityManager.transactional as jest.Mock).mockRejectedValueOnce(new Error('Oh no!'));

    await post(req as any, res as any);

    expect(entityManager.transactional).toBeCalledTimes(1);
    expect(entityManager.findOneOrFail).not.toBeCalled();
    expect(entityManager.persist).not.toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
