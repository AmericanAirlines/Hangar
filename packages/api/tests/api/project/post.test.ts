// import { Response } from 'express';
import { Project, User } from '@hangar/database';
import { post } from '../../../src/api/project/post';
import {
  MockEntityManager,
  createMockEntityManager,
} from '../../testUtils/createMockEntityManager';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

type Transaction = (em: MockEntityManager) => Promise<void>;

jest.mock('@hangar/database', () => ({
  Project: jest.fn(),
}));

describe('project post enpoint', () => {
  it('should return 200 if the project is successfully created', async () => {
    const mockUser = { id: '1' };
    const entityManager = createMockEntityManager({
      findOneOrFail: jest.fn().mockResolvedValueOnce(mockUser),
    });
    const req = createMockRequest({ entityManager, user: mockUser as any });
    const res = createMockResponse();

    await post(req as any, res as any);
    expect(res.sendStatus).toHaveBeenCalledWith(200);

    const mockProject = { contributors: { add: jest.fn() } };
    (Project.prototype.constructor as jest.Mock).mockReturnValueOnce(mockProject);

    expect(entityManager.transactional).toBeCalledTimes(1);
    const transaction = (entityManager.transactional as jest.Mock).mock.calls[0][0] as Transaction;
    await transaction(entityManager as any);

    expect(entityManager.findOneOrFail).toBeCalledTimes(1);
    expect(mockProject.contributors.add).toBeCalledWith(mockUser);
    expect(entityManager.persist).toBeCalledWith(mockProject);
  });

  // it('should return 409 if the project already exists', async () => {
  //   const req = {
  //     entityManager: {
  //       transactional: jest.fn((fn) => {
  //         const em = {
  //           findOneOrFail: jest.fn().mockImplementation(async (em: any) => {
  //             // return user with project
  //             return {
  //               id: '3',
  //               project: {
  //                 id: '1',
  //                 toReference: () => ({ id: '1' }),
  //               },
  //             };
  //           }),
  //           persist: jest.fn(),
  //         };
  //         fn(em);
  //       }),
  //     },
  //     user: {
  //       id: '3',
  //       project: {
  //         id: '1',
  //         toReference: () => ({ id: '1' }),
  //       },
  //     },
  //     body: {
  //       name: 'test',
  //       description: 'test',
  //       location: 'test',
  //     },
  //   };
  //   const res = {
  //     sendStatus: jest.fn(),
  //   };
  //   await post(req as any, res as any);
  //   expect(res.sendStatus).toHaveBeenCalledWith(409);
  // });

  // it('should return 500 if an error occurs', async () => {
  //   const req = {
  //     entityManager: {
  //       transactional: jest.fn(fn=>{
  //         const em = {
  //           findOneOrFail: jest.fn().mockImplementation(async (em: any) => {
  //             throw new Error('Something went wrong')
  //           }),
  //           persist: jest.fn(),
  //         }
  //         fn(em)
  //       }),
  //     },
  //     user: {
  //       id: '3',
  //       project: null,
  //     },
  //     body: {
  //       name: 'test',
  //       description: 'test',
  //       location: 'test',
  //     }
  //   };
  //   const res = {
  //     sendStatus: jest.fn(),
  //   };
  //   await post(req as any, res as any);
  //   expect(res.sendStatus).toHaveBeenCalledWith(500);
  // });
  // it('should return 423 if a locking error occurs', async () => {
  //   const req = {
  //     entityManager: {
  //       transactional: jest.fn(fn=>{
  //         const em = {
  //           findOneOrFail: jest.fn().mockImplementation(async (em: any) => {
  //             throw { code: '55P03' }
  //           }),
  //           persist: jest.fn(),
  //         }
  //         fn(em)
  //       }),
  //     },
  //     user: {
  //       id: '3',
  //       project: null,
  //     },
  //     body: {
  //       name: 'test',
  //       description: 'test',
  //       location: 'test',
  //     }
  //   };
  //   const res = {
  //     sendStatus: jest.fn(),
  //   };
  //   await post(req as any, res as any);
  //   expect(res.sendStatus).toHaveBeenCalledWith(423);
  // });
});
