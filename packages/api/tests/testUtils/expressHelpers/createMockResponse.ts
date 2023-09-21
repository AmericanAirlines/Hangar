export const createMockResponse = () => ({
  send: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn().mockReturnThis(),
  redirect: jest.fn(),
});
