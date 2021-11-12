import { Handler } from 'express';
import { project } from '../../src/api/project';
import { Project } from '../../src/entities/Project';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

jest.mock('../../src/middleware/populateUser', () => ({
  populateUser: jest.fn((): Handler => (_req, _res, next) => next()),
}));

const mockProject: Partial<Project> = {
  id: '1234',
  name: 'Project A',
  description: '',
  tableNumber: undefined,
};

const mockUserReference = { id: '1' };
const mockUser: Partial<User> = {
  id: mockUserReference.id,
  name: 'Mock User',
  toReference: jest.fn(() => mockUserReference),
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/project', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully returns the project for a user', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = mockUser as any;
      next();
    }, project);

    handler.entityManager.findOne.mockResolvedValueOnce(mockProject);
    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual(mockProject);
    expect(mockUser.toReference).toHaveBeenCalled();
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Project, {
      user: mockUserReference,
    });
  });

  it('returns a 500 when there was an issue fetching the project', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = mockUser as any;
      next();
    }, project);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));
    const { text } = await handler.get('/').expect(500);

    expect(text).toEqual('Uh oh, looks like there was an issue fetching your project!');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns a 404 when the project was not found for an update', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = mockUser as any;
      next();
    }, project);

    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/').expect(404);
  });
});
