import { Handler } from 'express';

export const createMockNext = () => jest.fn((req, res, next): Handler => next());
