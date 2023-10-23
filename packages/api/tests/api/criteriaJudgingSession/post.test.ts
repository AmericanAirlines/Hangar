import { Criteria, CriteriaJudgingSession, Project } from '@hangar/database';
import { post } from '../../../src/api/criteriaJudgingSession/post';
import { validatePayload } from '../../../src/utils/validatePayload';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';

jest.mock('@hangar/database', () => ({
  CriteriaJudgingSession: jest.fn(),
  Criteria: jest.fn(),
}));

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('criteriaJudgingSession POST handler', () => {
  it('creates a session with criteria and projects', async () => {
    const mockAdmin = { user: { id: '1' } };
    const req = createMockRequest({ admin: mockAdmin as any });
    const res = createMockResponse();

    const mockProjects: Project[] = [];
    req.entityManager.find.mockResolvedValueOnce(mockProjects);

    const mockCriteria = { test: true };
    const mockPayload = {
      title: '',
      description: '',
      criteriaList: [mockCriteria],
    };
    validatePayloadMock.mockReturnValueOnce({ data: mockPayload });

    const mockCjs = {
      projects: { set: jest.fn(), populated: jest.fn() },
      criteriaList: { set: jest.fn() },
    };
    (CriteriaJudgingSession.prototype.constructor as jest.Mock).mockReturnValueOnce(mockCjs);

    await post(req as any, res as any);

    const { criteriaList, ...constructorArgs } = mockPayload;
    expect(CriteriaJudgingSession.prototype.constructor).toBeCalledWith(
      expect.objectContaining(constructorArgs),
    );
    expect(mockCjs.projects.set).toBeCalledWith(mockProjects);

    expect(Criteria.prototype.constructor).toBeCalledTimes(mockPayload.criteriaList.length);
    expect(Criteria.prototype.constructor).toBeCalledWith(expect.objectContaining(mockCriteria));
    expect(mockCjs.criteriaList.set).toBeCalledTimes(1);

    expect(mockCjs.projects.populated).toBeCalledWith(false);

    expect(req.entityManager.transactional).toBeCalledTimes(1);
    expect(req.entityManager.persistAndFlush).toBeCalledWith(mockCjs);

    expect(res.send).toBeCalledWith(mockCjs);
  });

  it('bails if payload validation fails', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    validatePayloadMock.mockReturnValueOnce({ errorHandled: true });

    await post(req as any, res as any);

    expect(res.sendStatus).not.toBeCalled();
    expect(CriteriaJudgingSession.prototype.constructor).not.toBeCalled();
  });

  it('throws a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await post(req as any, res as any);

    expect(res.sendStatus).toBeCalledWith(500);
  });
});
