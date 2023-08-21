import { Response } from 'express';

type MockResponse = jest.Mocked<Partial<Response>>;

export const createMockResponse: () => MockResponse = () => ({
  send: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn().mockReturnThis(),
  redirect: jest.fn(),
});
