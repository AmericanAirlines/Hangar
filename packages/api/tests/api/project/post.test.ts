// import { Response } from 'express';
import { post } from '../../../src/api/project/post';


describe('project post enpoint', () => {
  it('should return 200 if the project is successfully created', async () => {
    const req = {
      entityManager: {
        transactional: jest.fn(fn=>{
          const em = {
            findOneOrFail:  jest.fn().mockImplementation(async (em: any) => {
              // return user with no project
              return {
                id: '3',
                project: null,
              }
            }),
            persist: jest.fn(),
          }
          fn(em)
        }),
      },
      user: {
        id: '3',
        project: null,
      },
      body: {
        name: 'test',
        description: 'test',
        location: 'test',
      }
    };
    const res = {
      sendStatus: jest.fn(),
    };
    await post(req as any, res as any);
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });
  // it('should return 409 if the project already exists', async () => {
  //   const req = {
  //     entityManager: {
  //       transactional: jest.fn(fn=>{
  //         const em = {
  //           findOneOrFail: jest.fn().mockImplementation(async (em: any) => {
  //             // return user with project
  //             return {
  //               id: '3',
  //               project: {
  //                 id: '1',
  //                 toReference:()=>({id:'1'})
  //               },
  //             }
  //           }),
  //           persist: jest.fn(),
  //         }
  //         fn(em)
  //       }),
  //     },
  //     user: {
  //       id: '3',
  //       project: {
  //         id: '1',
  //         toReference:()=>({id:'1'})
  //       },
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