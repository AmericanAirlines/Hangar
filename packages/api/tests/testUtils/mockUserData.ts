export const createMockUser = () => ({
  firstName: 'a',
  lastName: 'b',
  email: 'a@b.c',
  project: undefined,
});

export const createMockReq: any = () => ({
  session: {
    id: undefined,
  },
  entityManager: {
    findOne: jest.fn((entity, query) => {
      return query.id ? createMockUser() : undefined;
    }),
  },
  user: undefined,
});

export const createMockRes = () => ({
  sendStatus: jest.fn(),
});
