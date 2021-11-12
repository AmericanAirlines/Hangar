import { projects } from '../../src/api/projects';
import { Project } from '../../src/entities/Project';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const mockProjects: Partial<Project>[] = [
  {
    id: '1234',
    name: 'Project A',
    description: '',
    tableNumber: undefined,
  },
  {
    name: 'Project B',
    description: '',
    tableNumber: undefined,
  },
];

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 403 for non admin user', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { isAdmin: false } as any;
      next();
    }, projects);

    await handler.get('/').expect(403);
  });

  it('successfully returns all projects sorted by createdAt', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { isAdmin: true } as any;
      next();
    }, projects);
    handler.entityManager.find.mockResolvedValueOnce(mockProjects);
    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual(mockProjects);
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      Project,
      {},
      { orderBy: { createdAt: 'ASC' } },
    );
  });

  it('returns a 500 when there was an issue fetching the projects', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { isAdmin: true } as any;
      next();
    }, projects);
    handler.entityManager.find.mockRejectedValueOnce(new Error('Error has occurred'));
    const { text } = await handler.get('/').expect(500);

    expect(text).toEqual('Uh oh, looks like there was an issue fetching the list of projects!');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully creates a new project', async () => {
    const mockUserEntity = { name: 'mockUser', isAdmin: true };
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { ...mockUserEntity, toReference: () => mockUserEntity } as any;
      next();
    }, projects);

    handler.entityManager.persistAndFlush.mockImplementationOnce((async (project: Project) => {
      // eslint-disable-next-line no-param-reassign
      project.toJSON = () => mockProjects[0];
    }) as any);

    const { body } = await handler.post('/').send(mockProjects[0]).expect(200);

    expect(body).toEqual(mockProjects[0]);
    const { id, ...expectedPersistProject } = mockProjects[0];
    expect(handler.entityManager.persistAndFlush).toHaveBeenCalledWith(
      expect.objectContaining(expectedPersistProject),
    );
  });

  it('returns a 500 when there was an issue creating the project', async () => {
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { isAdmin: true } as any;
      next();
    }, projects);
    handler.entityManager.persistAndFlush.mockRejectedValueOnce(new Error('Error has occurred'));
    const { text } = await handler.post('/').expect(500);

    expect(text).toEqual('Uh oh, looks like there was an issue creating a new project!');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully updates a project', async () => {
    const mockUserEntity = { name: 'mockUser', isAdmin: true };
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { ...mockUserEntity, toReference: () => mockUserEntity } as any;
      next();
    }, projects);

    const mockProject = { ...mockProjects[0] };
    handler.entityManager.findOne.mockResolvedValueOnce(mockProject);

    const newName = 'wow cool';
    const { body } = await handler
      .put(`/${mockProject.id}`)
      .send({ ...mockProject, name: newName })
      .expect(200);

    expect(mockProject.name).toEqual(newName);
    expect(body).toEqual({ ...mockProject, name: newName });
    expect(handler.entityManager.flush).toHaveBeenCalled();
  });

  it('successfully updates a project with default values if name and description are not sent', async () => {
    const mockUserEntity = { name: 'mockUser', isAdmin: true };
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { ...mockUserEntity, toReference: () => mockUserEntity } as any;
      next();
    }, projects);

    const mockProject = { ...mockProjects[0] };
    handler.entityManager.findOne.mockResolvedValueOnce(mockProject);

    await handler
      .put(`/${mockProject.id}`)
      .send({ ...mockProject, name: undefined, description: undefined })
      .expect(200);

    expect(mockProject.name).toEqual('');
    expect(mockProject.description).toEqual('');
    expect(handler.entityManager.flush).toHaveBeenCalled();
  });

  it('returns a 404 when the project was not found for an update', async () => {
    const mockUserEntity = { name: 'mockUser', isAdmin: true };
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { ...mockUserEntity, toReference: () => mockUserEntity } as any;
      next();
    }, projects);

    handler.entityManager.findOne.mockResolvedValueOnce(null);

    const newName = 'wow cool';
    await handler
      .put(`/${mockProjects[0].id}`)
      .send({ ...mockProjects[0], name: newName })
      .expect(404);
  });

  it('returns a 500 when there was an issue updating a project', async () => {
    const mockUserEntity = { name: 'mockUser', isAdmin: true };
    const handler = testHandler((req, _res, next) => {
      req.userEntity = { ...mockUserEntity, toReference: () => mockUserEntity } as any;
      next();
    }, projects);

    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));

    const newName = 'wow cool';
    const { text } = await handler
      .put(`/${mockProjects[0].id}`)
      .send({ ...mockProjects[0], name: newName })
      .expect(500);

    expect(text).toEqual('Uh oh, looks like there was an issue updating the project!');
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
