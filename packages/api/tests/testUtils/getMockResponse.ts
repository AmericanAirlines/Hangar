import { Response } from 'express';

type MockResponse = jest.Mocked<Partial<Response>>;

export const getMockResponse: () => MockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
});
